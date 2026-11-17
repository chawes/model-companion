import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DifficultyDots } from '../components/DifficultyDots';
import { durationText } from '../data/poses';
import type { PreparedImage } from '../lib/image';
import type { Pose, PoseCategory } from '../types';
import { PoseEditor, type PoseDraft } from './PoseEditor';
import { btnGhost, btnPrimary, DEPLOY_NOTE, StatusBar, type Call, type Message } from './shared';

const CAT_LABEL: Record<PoseCategory, string> = { standing: 'Stoj', seated: 'Sed', floor: 'Na zemi', action: 'Akce' };

export function PosesAdmin({ call }: { call: Call }) {
  const [poses, setPoses] = useState<Pose[] | null>(null);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState<Message>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    call<Pose[]>('poses', 'GET')
      .then(setPoses)
      .catch((e) => setMessage({ text: (e as Error).message, error: true }));
  }, [call]);

  const done = (text: string) => setMessage({ text: `${text} ${DEPLOY_NOTE}` });
  const fail = (e: unknown) => setMessage({ text: (e as Error).message, error: true });

  const body = (draft: PoseDraft) => ({
    title: draft.title,
    tip: draft.tip,
    category: draft.category,
    duration: draft.duration,
    difficulty: draft.difficulty,
    credit: draft.credit,
  });

  const save = async (draft: PoseDraft, image: PreparedImage | null) => {
    setBusy(editing === 'new' ? 'Přidávám pózu…' : 'Ukládám…');
    setMessage(null);
    try {
      const img = image ? { base64: image.base64 } : undefined;
      if (editing === 'new') {
        const next = await call<Pose[]>('poses', 'POST', { pose: body(draft), image: img });
        const added = next.at(-1)!;
        if (image) setPreviews((p) => ({ ...p, [added.id]: image.preview }));
        setPoses(next);
        done(`Póza „${draft.title.cs}“ přidána.`);
      } else if (editing) {
        const next = await call<Pose[]>('poses', 'PUT', { id: editing, pose: body(draft), image: img });
        if (image) setPreviews((p) => ({ ...p, [editing]: image.preview }));
        setPoses(next);
        done('Uloženo.');
      }
      setEditing(null);
    } catch (e) {
      fail(e);
    } finally {
      setBusy('');
    }
  };

  const move = (from: number, to: number) => {
    if (!poses || to < 0 || to >= poses.length) return;
    const next = [...poses];
    const [p] = next.splice(from, 1);
    next.splice(to, 0, p);
    setPoses(next);
    setDirty(true);
  };

  const saveOrder = async () => {
    if (!poses) return;
    setBusy('Ukládám pořadí…');
    try {
      setPoses(await call<Pose[]>('poses', 'PUT', { order: poses.map((p) => p.id) }));
      setDirty(false);
      done('Pořadí uloženo.');
    } catch (e) {
      fail(e);
    } finally {
      setBusy('');
    }
  };

  const remove = async (pose: Pose) => {
    if (confirmDelete !== pose.id) {
      setConfirmDelete(pose.id);
      return;
    }
    setConfirmDelete(null);
    setBusy('Mažu…');
    setMessage(null);
    try {
      await call<Pose[]>('poses', 'DELETE', { id: pose.id });
      setPoses((cur) => cur && cur.filter((p) => p.id !== pose.id)); // keep unsaved local order
      done(`Póza „${pose.title.cs}“ smazána.`);
    } catch (e) {
      fail(e);
    } finally {
      setBusy('');
    }
  };

  const editingPose = poses?.find((p) => p.id === editing);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="text-sm text-muted">{poses ? `${poses.length} póz · pořadí = číslo No. v appce` : 'Načítám…'}</p>
        <button
          type="button"
          className={btnPrimary}
          disabled={!!busy || editing !== null || dirty}
          onClick={() => setEditing('new')}
          title={dirty ? 'Nejdřív ulož pořadí' : undefined}
        >
          <Plus size={18} aria-hidden /> Přidat pózu
        </button>
      </div>

      <StatusBar busy={busy} message={message} />

      {editing !== null && (
        <PoseEditor
          key={editing}
          pose={editing === 'new' ? undefined : editingPose}
          preview={editing !== 'new' ? previews[editing] : undefined}
          busy={!!busy}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}

      {poses && (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {poses.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 py-3 md:gap-4">
              <span className="w-7 shrink-0 text-right text-[0.8rem] text-faint">{String(i + 1).padStart(2, '0')}</span>
              <div className="size-14 shrink-0 overflow-hidden rounded-[4px] bg-neutral md:size-16">
                <img
                  src={previews[p.id] ?? p.image}
                  alt=""
                  loading="lazy"
                  className={`h-full w-full ${p.credit.placeholder ? 'object-contain' : 'object-cover'}`}
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden';
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {p.title.cs}
                  {!p.title.en && <span className="ml-2 text-[0.72rem] font-normal text-red-bright">chybí EN</span>}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-[0.78rem] text-muted">
                  {CAT_LABEL[p.category]} · {durationText(p.duration)} min · <DifficultyDots value={p.difficulty} />
                  {p.credit.placeholder && <span className="text-faint">· dočasný obrázek</span>}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" className={`${btnGhost} size-9! px-0!`} onClick={() => move(i, i - 1)} disabled={i === 0 || !!busy} aria-label="Posunout nahoru">
                  <ArrowUp size={15} aria-hidden />
                </button>
                <button type="button" className={`${btnGhost} size-9! px-0!`} onClick={() => move(i, i + 1)} disabled={i === poses.length - 1 || !!busy} aria-label="Posunout dolů">
                  <ArrowDown size={15} aria-hidden />
                </button>
                <button
                  type="button"
                  className={`${btnGhost} h-9!`}
                  onClick={() => setEditing(p.id)}
                  disabled={!!busy || editing !== null || dirty}
                  aria-label={`Upravit ${p.title.cs}`}
                >
                  <Pencil size={15} aria-hidden /> <span className="hidden sm:inline">Upravit</span>
                </button>
                <button
                  type="button"
                  className={`${btnGhost} h-9! ${confirmDelete === p.id ? 'border-red! bg-red! text-white!' : ''}`}
                  onClick={() => remove(p)}
                  disabled={!!busy || editing !== null}
                  aria-label={`Smazat ${p.title.cs}`}
                >
                  {confirmDelete === p.id ? 'Smazat?' : <Trash2 size={15} aria-hidden />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {dirty && (
        <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 md:bottom-6">
          <button type="button" onClick={saveOrder} disabled={!!busy} className="h-12 rounded-md bg-red px-8 font-semibold text-white hover:bg-red-bright disabled:opacity-50">
            Uložit pořadí
          </button>
        </div>
      )}
    </section>
  );
}

import { ImagePlus } from 'lucide-react';
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { DifficultyDots } from '../components/DifficultyDots';
import { CATEGORIES, DURATIONS, durationText } from '../data/poses';
import { prepareImage, type PreparedImage } from '../lib/image';
import type { Difficulty, Pose, PoseCategory, PoseDuration } from '../types';
import { btnGhost, btnPrimary, Field, input } from './shared';

const CAT_LABEL: Record<PoseCategory, string> = { standing: 'Stoj', seated: 'Sed', floor: 'Na zemi', action: 'Akce' };
const DIFF_LABEL: Record<Difficulty, string> = { 1: 'Snadná', 2: 'Střední', 3: 'Náročná' };

export interface PoseDraft {
  title: { cs: string; en: string };
  tip: { cs: string; en: string };
  category: PoseCategory;
  duration: PoseDuration;
  difficulty: Difficulty;
  credit: { author: string; license: string; aiGenerated: boolean };
}

const fromPose = (p?: Pose): PoseDraft => ({
  title: { cs: p?.title.cs ?? '', en: p?.title.en ?? '' },
  tip: { cs: p?.tip.cs ?? '', en: p?.tip.en ?? '' },
  category: p?.category ?? 'standing',
  duration: p?.duration ?? '10',
  difficulty: p?.difficulty ?? 1,
  credit: {
    author: p && !p.credit.placeholder ? p.credit.author : '',
    license: p && !p.credit.placeholder ? p.credit.license : '',
    aiGenerated: Boolean(p?.credit.aiGenerated),
  },
});

function Choice<T extends string | number>({
  options,
  value,
  onChange,
  render,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  render: (v: T) => ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={String(o)}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={`inline-flex h-9 items-center rounded-full border px-3.5 text-[0.85rem] transition-colors ${
            value === o ? 'border-red-bright bg-red-bright text-white' : 'border-fg/35 hover:border-fg'
          }`}
        >
          {render(o)}
        </button>
      ))}
    </div>
  );
}

interface Props {
  pose?: Pose;
  /** local preview of a just-uploaded image that isn't deployed yet */
  preview?: string;
  busy: boolean;
  onSave: (draft: PoseDraft, image: PreparedImage | null) => void;
  onCancel: () => void;
}

export function PoseEditor({ pose, preview, busy, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<PoseDraft>(() => fromPose(pose));
  const [image, setImage] = useState<PreparedImage | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const isNew = !pose;

  const set = <K extends keyof PoseDraft>(key: K, value: PoseDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setPreparing(true);
    try {
      setImage(await prepareImage(file));
      setError('');
    } catch {
      setError('Obrázek se nepodařilo načíst.');
    } finally {
      setPreparing(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isNew && !image) return setError('Vyber obrázek.');
    if (!draft.title.cs.trim()) return setError('Vyplň český název.');
    if (!draft.tip.cs.trim()) return setError('Vyplň českou radu.');
    setError('');
    onSave(draft, image);
  };

  const shown = image?.preview ?? preview ?? pose?.image;

  return (
    <form onSubmit={submit} className="mt-6 rounded-md border border-line bg-surface p-4 md:p-6">
      <h2 className="font-display text-[1.3rem]">{isNew ? 'Nová póza' : `Upravit: ${pose.title.cs}`}</h2>

      <div className="mt-5 grid gap-6 md:grid-cols-[16rem_1fr] md:gap-8">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-neutral">
            {shown ? (
              <img src={shown} alt="" className={`h-full w-full ${pose?.credit.placeholder && !image ? 'object-contain' : 'object-cover'}`} />
            ) : (
              <div className="grid h-full place-items-center text-sm text-black/50">Bez obrázku</div>
            )}
          </div>
          <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
          <button type="button" onClick={() => fileInput.current?.click()} className={`${btnGhost} mt-3 w-full`} disabled={preparing}>
            <ImagePlus size={17} aria-hidden /> {preparing ? 'Připravuji…' : shown ? 'Vyměnit obrázek' : 'Vybrat obrázek'}
          </button>
          <p className="mt-2 text-[0.78rem] text-faint">Nejlépe na výšku 4:5. Zmenší se automaticky.</p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Název (CZ) *">
              <input className={input} value={draft.title.cs} onChange={(e) => set('title', { ...draft.title, cs: e.target.value })} maxLength={80} />
            </Field>
            <Field label="Název (EN)" hint="Když zůstane prázdné, ukáže se česky.">
              <input className={input} value={draft.title.en} onChange={(e) => set('title', { ...draft.title, en: e.target.value })} maxLength={80} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rada pro modela (CZ) *">
              <textarea
                className={`${input} h-28 resize-y py-2`}
                value={draft.tip.cs}
                onChange={(e) => set('tip', { ...draft.tip, cs: e.target.value })}
                maxLength={400}
              />
            </Field>
            <Field label="Rada pro modela (EN)">
              <textarea
                className={`${input} h-28 resize-y py-2`}
                value={draft.tip.en}
                onChange={(e) => set('tip', { ...draft.tip, en: e.target.value })}
                maxLength={400}
              />
            </Field>
          </div>

          <Field label="Kategorie" group>
            <Choice options={CATEGORIES.map((c) => c.id)} value={draft.category} onChange={(v) => set('category', v)} render={(v) => CAT_LABEL[v]} />
          </Field>
          <Field label="Doporučená délka" group>
            <Choice options={DURATIONS} value={draft.duration} onChange={(v) => set('duration', v)} render={(v) => `${durationText(v)} min`} />
          </Field>
          <Field label="Obtížnost" group>
            <Choice
              options={[1, 2, 3] as const}
              value={draft.difficulty}
              onChange={(v) => set('difficulty', v)}
              render={(v) => (
                <span className="inline-flex items-center gap-2">
                  <DifficultyDots value={v} /> {DIFF_LABEL[v]}
                </span>
              )}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Autor obrázku" hint="Např. Foto: Jana Nováková pro DCP">
              <input className={input} value={draft.credit.author} onChange={(e) => set('credit', { ...draft.credit, author: e.target.value })} />
            </Field>
            <Field label="Licence / povolení" hint="Např. Se souhlasem modelky a fotografa">
              <input className={input} value={draft.credit.license} onChange={(e) => set('credit', { ...draft.credit, license: e.target.value })} />
            </Field>
          </div>
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={draft.credit.aiGenerated}
              onChange={(e) => set('credit', { ...draft.credit, aiGenerated: e.target.checked })}
              className="size-4 accent-[#e43737]"
            />
            Obrázek vytvořený pomocí AI (v appce se to u obrázku uvede)
          </label>

          {error && <p className="text-sm text-red-bright">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className={btnPrimary} disabled={busy || preparing}>
              {isNew ? 'Přidat pózu' : 'Uložit změny'}
            </button>
            <button type="button" className={btnGhost} onClick={onCancel} disabled={busy}>
              Zrušit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

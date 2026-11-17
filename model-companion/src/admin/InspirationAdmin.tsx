import { ArrowLeft, ArrowRight, ArrowUpToLine, ImagePlus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { InspirationItem } from '../data/inspiration';
import { prepareImage, type PreparedImage } from '../lib/image';
import { btnPrimary, DEPLOY_NOTE, StatusBar, tileBtn, type Call, type Message } from './shared';

const BATCH_BYTES = 3_000_000; // stay well under Vercel's 4.5 MB request limit

export function InspirationAdmin({ call }: { call: Call }) {
  const [items, setItems] = useState<InspirationItem[] | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState<Message>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const dragFrom = useRef<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    call<{ items: InspirationItem[] }>('inspiration', 'GET')
      .then((d) => setItems(d.items))
      .catch((e) => setMessage({ text: (e as Error).message, error: true }));
  }, [call]);

  const done = (text: string) => setMessage({ text: `${text} ${DEPLOY_NOTE}` });
  const fail = (e: unknown) => setMessage({ text: (e as Error).message, error: true });

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setMessage(null);
    try {
      const prepared: PreparedImage[] = [];
      for (let i = 0; i < list.length; i++) {
        setBusy(`Připravuji ${i + 1}/${list.length}…`);
        prepared.push(await prepareImage(list[i]));
      }
      let sent = 0;
      while (sent < prepared.length) {
        const batch: PreparedImage[] = [];
        let size = 0;
        while (sent + batch.length < prepared.length && batch.length < 10) {
          const next = prepared[sent + batch.length];
          if (batch.length > 0 && size + next.base64.length > BATCH_BYTES) break;
          batch.push(next);
          size += next.base64.length;
        }
        setBusy(`Nahrávám ${sent + batch.length}/${prepared.length}…`);
        const data = await call<{ items: InspirationItem[] }>('inspiration', 'POST', {
          images: batch.map(({ base64, w, h }) => ({ base64, w, h })),
        });
        const added = data.items.slice(0, batch.length);
        setPreviews((p) => ({ ...p, ...Object.fromEntries(added.map((it, k) => [it.id, batch[k].preview])) }));
        setItems(data.items);
        sent += batch.length;
      }
      done(`Přidáno ${prepared.length} obr.`);
    } catch (e) {
      fail(e);
    } finally {
      setBusy('');
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const move = (from: number, to: number) => {
    if (!items || to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    setItems(next);
    setDirty(true);
  };

  const setSource = (id: string, source: string) => {
    setItems((cur) => cur && cur.map((it) => (it.id === id ? { ...it, source } : it)));
    setDirty(true);
  };

  const save = async () => {
    if (!items) return;
    setBusy('Ukládám…');
    setMessage(null);
    try {
      const data = await call<{ items: InspirationItem[] }>('inspiration', 'PUT', { items: items.map(({ id, source }) => ({ id, source })) });
      setItems(data.items);
      setDirty(false);
      done('Uloženo.');
    } catch (e) {
      fail(e);
    } finally {
      setBusy('');
    }
  };

  const remove = async (id: string) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }
    setConfirmDelete(null);
    setBusy('Mažu…');
    setMessage(null);
    try {
      await call('inspiration', 'DELETE', { ids: [id] });
      setItems((cur) => cur && cur.filter((it) => it.id !== id)); // keep unsaved local order
      done('Smazáno.');
    } catch (e) {
      fail(e);
    } finally {
      setBusy('');
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="text-sm text-muted">
          {items ? `${items.length} obrázků · ` : ''}přetáhni nebo použij šipky · pořadí a zdroje ulož tlačítkem dole
        </p>
        <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
        <button type="button" disabled={!!busy || dirty} onClick={() => fileInput.current?.click()} className={btnPrimary} title={dirty ? 'Nejdřív ulož změny' : undefined}>
          <ImagePlus size={18} aria-hidden /> Přidat obrázky
        </button>
      </div>

      <StatusBar busy={busy} message={message} />
      {dirty && !busy && <p className="mt-3 text-sm text-red-bright">Máš neuložené změny. Před přidáváním obrázků je ulož.</p>}

      {items === null ? (
        <p className="mt-10 text-muted">Načítám…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 rounded-md border border-dashed border-line px-6 py-16 text-center text-muted">
          Zatím žádné obrázky. Klikni na „Přidat obrázky“ — můžeš vybrat víc najednou.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((it, i) => (
            <li
              key={it.id}
              draggable
              onDragStart={() => (dragFrom.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragFrom.current !== null) move(dragFrom.current, i);
                dragFrom.current = null;
              }}
              className="flex flex-col gap-2"
            >
              <div className="relative aspect-[4/5] cursor-grab overflow-hidden rounded-md bg-surface-2 active:cursor-grabbing">
                <img
                  src={previews[it.id] ?? it.file}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden';
                  }}
                />
                <span className="absolute left-2 top-2 rounded-[3px] bg-black/70 px-2 py-0.5 text-[0.65rem] text-white">{i + 1}</span>
                <div className="absolute inset-x-2 bottom-2 flex justify-between">
                  <div className="flex gap-1">
                    <button type="button" className={tileBtn} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Posunout dopředu">
                      <ArrowLeft size={15} aria-hidden />
                    </button>
                    <button type="button" className={tileBtn} onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label="Posunout dozadu">
                      <ArrowRight size={15} aria-hidden />
                    </button>
                    <button type="button" className={tileBtn} onClick={() => move(i, 0)} disabled={i === 0} aria-label="Na začátek">
                      <ArrowUpToLine size={15} aria-hidden />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(it.id)}
                    disabled={!!busy}
                    aria-label="Smazat"
                    className={`${tileBtn} ${confirmDelete === it.id ? 'w-auto! bg-red! px-3 text-[0.72rem] font-medium' : ''}`}
                  >
                    {confirmDelete === it.id ? 'Smazat?' : <Trash2 size={15} aria-hidden />}
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={it.source ?? ''}
                onChange={(e) => setSource(it.id, e.target.value)}
                placeholder="Zdroj / autor (nepovinné)"
                className="h-9 rounded-[4px] border border-line bg-surface px-2.5 text-[0.8rem] outline-none focus:border-fg"
              />
            </li>
          ))}
        </ul>
      )}

      {dirty && (
        <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 md:bottom-6">
          <button type="button" onClick={save} disabled={!!busy} className="h-12 rounded-md bg-red px-8 font-semibold text-white hover:bg-red-bright disabled:opacity-50">
            Uložit změny
          </button>
        </div>
      )}
    </section>
  );
}

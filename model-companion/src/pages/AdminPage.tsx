import { ArrowLeft, ArrowRight, ArrowUpToLine, ImagePlus, LogOut, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import type { InspirationItem } from '../data/inspiration';
import { useDocumentTitle } from '../i18n/LangContext';

/**
 * /admin — manage the Inspiration board (Czech only, for organizers).
 * Changes are committed to GitHub by /api/inspiration and appear on the site after the next deploy (~1 min).
 */

const PW_KEY = 'model-companion:admin';
const MAX_EDGE = 1600;
const BATCH_BYTES = 3_000_000; // stay well under Vercel's 4.5 MB request limit

interface Prepared {
  base64: string;
  w: number;
  h: number;
  preview: string;
}

async function prepare(file: File): Promise<Prepared> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('toBlob'))), 'image/jpeg', 0.85));
  const base64 = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1] ?? '');
    r.onerror = () => rej(r.error);
    r.readAsDataURL(blob);
  });
  return { base64, w, h, preview: URL.createObjectURL(blob) };
}

export function AdminPage() {
  useDocumentTitle('Admin');
  const [password, setPassword] = useState(() => sessionStorage.getItem(PW_KEY) ?? '');
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const dragFrom = useRef<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const call = useCallback(
    async (method: string, body?: unknown, pw = password) => {
      const res = await fetch('/api/inspiration', {
        method,
        headers: { 'x-admin-password': pw, ...(body ? { 'content-type': 'application/json' } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({ error: `Chyba serveru (${res.status})` }));
      if (!res.ok) throw new Error(data.error || `Chyba ${res.status}`);
      return data as { items: InspirationItem[] };
    },
    [password],
  );

  const login = async (pw: string) => {
    setBusy('Přihlašuji…');
    setMessage(null);
    try {
      const data = await call('GET', undefined, pw);
      sessionStorage.setItem(PW_KEY, pw);
      setItems(data.items);
      setAuthed(true);
    } catch (e) {
      sessionStorage.removeItem(PW_KEY);
      setMessage({ text: (e as Error).message, error: true });
    } finally {
      setBusy('');
    }
  };

  useEffect(() => {
    if (password) login(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = (text: string) => setMessage({ text: `${text} Na webu se změna objeví asi za minutu.` });
  const fail = (e: unknown) => setMessage({ text: (e as Error).message, error: true });

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setMessage(null);
    try {
      const prepared: Prepared[] = [];
      for (let i = 0; i < list.length; i++) {
        setBusy(`Připravuji ${i + 1}/${list.length}…`);
        prepared.push(await prepare(list[i]));
      }
      // send in batches small enough for one request each
      let sent = 0;
      while (sent < prepared.length) {
        const batch: Prepared[] = [];
        let size = 0;
        while (sent + batch.length < prepared.length && batch.length < 10) {
          const next = prepared[sent + batch.length];
          if (batch.length > 0 && size + next.base64.length > BATCH_BYTES) break;
          batch.push(next);
          size += next.base64.length;
        }
        setBusy(`Nahrávám ${sent + batch.length}/${prepared.length}…`);
        const data = await call('POST', { images: batch.map(({ base64, w, h }) => ({ base64, w, h })) });
        // newest are at the top of the returned list — attach local previews until the site redeploys
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
    if (to < 0 || to >= items.length || from === to) return;
    setItems((cur) => {
      const next = [...cur];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
    setDirty(true);
  };

  const setSource = (id: string, source: string) => {
    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, source } : it)));
    setDirty(true);
  };

  const save = async () => {
    setBusy('Ukládám…');
    setMessage(null);
    try {
      const data = await call('PUT', { items: items.map(({ id, source }) => ({ id, source })) });
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
      await call('DELETE', { ids: [id] });
      setItems((cur) => cur.filter((it) => it.id !== id)); // keep unsaved local order
      done('Smazáno.');
    } catch (e) {
      fail(e);
    } finally {
      setBusy('');
    }
  };

  const logout = () => {
    sessionStorage.removeItem(PW_KEY);
    setPassword('');
    setAuthed(false);
    setItems([]);
  };

  if (!authed) {
    return (
      <form
        className="mx-auto flex max-w-sm flex-col gap-4 px-5 py-20"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          login(password);
        }}
      >
        <h1 className="font-display text-[2.4rem] leading-none">Admin</h1>
        <p className="text-ink-soft">Správa nástěnky Inspirace.</p>
        <label className="flex flex-col gap-1.5 text-sm">
          Heslo
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-[4px] border border-line bg-paper-bright px-4 text-base outline-none focus:border-ink"
          />
        </label>
        <button type="submit" disabled={!password || !!busy} className="h-12 rounded-full bg-ink font-medium text-paper-bright disabled:opacity-40">
          {busy || 'Přihlásit'}
        </button>
        {message && <p className={message.error ? 'text-sm text-sanguine' : 'text-sm text-ink-soft'}>{message.text}</p>}
      </form>
    );
  }

  const tileBtn = 'grid size-9 place-items-center rounded-full bg-paper-bright/90 text-ink shadow-sm disabled:opacity-30';

  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 pt-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[2.4rem] leading-none">Inspirace — admin</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {items.length} obrázků · přetáhni nebo použij šipky · změny pořadí a zdrojů ulož tlačítkem dole
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
          <button
            type="button"
            disabled={!!busy || dirty}
            onClick={() => fileInput.current?.click()}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper-bright disabled:opacity-40"
            title={dirty ? 'Nejdřív ulož změny' : undefined}
          >
            <ImagePlus size={18} aria-hidden /> Přidat obrázky
          </button>
          <button type="button" onClick={logout} aria-label="Odhlásit" className="grid size-11 place-items-center rounded-full border border-line text-ink-soft hover:text-ink">
            <LogOut size={17} aria-hidden />
          </button>
        </div>
      </div>

      {(busy || message) && (
        <p role="status" className={`mt-5 rounded-[4px] px-4 py-3 text-sm ${message?.error ? 'bg-sanguine-soft text-sanguine' : 'bg-paper-deep text-ink'}`}>
          {busy || message?.text}
        </p>
      )}
      {dirty && !busy && <p className="mt-3 text-sm text-sanguine">Máš neuložené změny. Před přidáváním obrázků je ulož.</p>}

      {items.length === 0 ? (
        <p className="mt-10 rounded-[4px] border border-dashed border-line px-6 py-16 text-center text-ink-soft">
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
              className="group flex flex-col gap-2"
            >
              <div className="relative aspect-[4/5] cursor-grab overflow-hidden rounded-[3px] bg-paper-deep active:cursor-grabbing">
                <img
                  src={previews[it.id] ?? it.file}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                  onError={(e) => ((e.currentTarget.style.visibility = 'hidden'))}
                />
                <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[0.65rem] text-paper-bright">{i + 1}</span>
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
                    className={`${tileBtn} ${confirmDelete === it.id ? 'w-auto! bg-sanguine! px-3 text-[0.72rem] font-medium text-paper-bright!' : ''}`}
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
                className="h-9 rounded-[3px] border border-line bg-paper-bright px-2.5 text-[0.8rem] outline-none focus:border-ink"
              />
            </li>
          ))}
        </ul>
      )}

      {dirty && (
        <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 md:bottom-6">
          <button type="button" onClick={save} disabled={!!busy} className="h-12 rounded-full bg-sanguine px-8 font-medium text-paper-bright shadow-lg disabled:opacity-50">
            Uložit změny
          </button>
        </div>
      )}
    </div>
  );
}

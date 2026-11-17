/**
 * Inspiration board admin API — see _github.js for configuration.
 */
import { commit, handle, HttpError, jsonChange, readJson } from './_github.js';

const INDEX = 'public/inspiration/index.json';
const MAX_ITEMS = 2000;

const readIndex = async () => {
  const d = await readJson(INDEX, { items: [] });
  return Array.isArray(d.items) ? d : { items: [] };
};

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const cleanSource = (s) => (typeof s === 'string' ? s.trim().slice(0, 300) : '');

/** Current board straight from GitHub (newer than the deployed copy). */
export function GET(request) {
  return handle(request, readIndex);
}

/** Upload: { images: [{ base64, w, h, source? }] } — newest go first. */
export function POST(request) {
  return handle(request, async () => {
    const body = await request.json();
    const images = Array.isArray(body.images) ? body.images.slice(0, 10) : [];
    if (images.length === 0) throw new HttpError(400, 'Žádné obrázky.');
    const index = await readIndex();
    if (index.items.length + images.length > MAX_ITEMS) throw new HttpError(400, 'Nástěnka je plná.');
    const added = [];
    const changes = [];
    for (const img of images) {
      if (typeof img.base64 !== 'string' || img.base64.length < 100) throw new HttpError(400, 'Neplatný obrázek.');
      const id = newId();
      const file = `/inspiration/${id}.jpg`;
      changes.push({ path: `public${file}`, base64: img.base64 });
      added.push({ id, file, w: Math.round(Number(img.w) || 1000), h: Math.round(Number(img.h) || 1250), source: cleanSource(img.source) });
    }
    index.items = [...added, ...index.items];
    changes.push(jsonChange(INDEX, index));
    await commit(changes, `Inspirace: přidáno ${added.length} obr.`);
    return index;
  });
}

/** Save order and sources: { items: [{ id, source }] } */
export function PUT(request) {
  return handle(request, async () => {
    const body = await request.json();
    const wanted = Array.isArray(body.items) ? body.items : [];
    const index = await readIndex();
    const byId = new Map(index.items.map((i) => [i.id, i]));
    const ordered = [];
    for (const w of wanted) {
      const item = byId.get(w.id);
      if (!item) continue;
      ordered.push({ ...item, source: cleanSource(w.source) });
      byId.delete(w.id);
    }
    index.items = [...ordered, ...byId.values()]; // never drop items the client didn't know about
    await commit([jsonChange(INDEX, index)], 'Inspirace: pořadí a zdroje');
    return index;
  });
}

/** Delete: { ids: [...] } */
export function DELETE(request) {
  return handle(request, async () => {
    const body = await request.json();
    const ids = new Set(Array.isArray(body.ids) ? body.ids : []);
    const index = await readIndex();
    const removed = index.items.filter((i) => ids.has(i.id));
    if (removed.length === 0) return index;
    index.items = index.items.filter((i) => !ids.has(i.id));
    await commit(
      [...removed.map((i) => ({ path: `public${i.file}`, delete: true })), jsonChange(INDEX, index)],
      `Inspirace: smazáno ${removed.length} obr.`,
    );
    return index;
  });
}

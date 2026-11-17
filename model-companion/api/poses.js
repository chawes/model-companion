/**
 * Pose library admin API — see _github.js for configuration.
 *
 * Poses live in src/data/poses.json (bundled into the app), images in public/poses/.
 * Every change is one commit; Vercel rebuilds the site in about a minute.
 */
import { cleanText, commit, handle, HttpError, jsonChange, readJson } from './_github.js';

const DATA = 'src/data/poses.json';
const CATEGORIES = ['standing', 'seated', 'floor', 'action'];
const DURATIONS = ['1-2', '3-5', '10', '15-20'];

const readPoses = async () => {
  const d = await readJson(DATA, []);
  return Array.isArray(d) ? d : [];
};

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'poza';

const uniqueId = (base, poses) => {
  let id = base;
  for (let n = 2; poses.some((p) => p.id === id); n++) id = `${base}-${n}`;
  return id;
};

const loc = (v, max) => ({ cs: cleanText(v?.cs, max), en: cleanText(v?.en, max) });

/** Validate and normalise the editable fields of a pose. */
function fields(input) {
  const title = loc(input.title, 80);
  const tip = loc(input.tip, 400);
  if (!title.cs) throw new HttpError(400, 'Chybí český název.');
  if (!tip.cs) throw new HttpError(400, 'Chybí česká rada.');
  if (!CATEGORIES.includes(input.category)) throw new HttpError(400, 'Neplatná kategorie.');
  if (!DURATIONS.includes(input.duration)) throw new HttpError(400, 'Neplatná délka.');
  const difficulty = Number(input.difficulty);
  if (![1, 2, 3].includes(difficulty)) throw new HttpError(400, 'Neplatná obtížnost.');
  const alt = loc(input.imageAlt, 200);
  return {
    title,
    imageAlt: { cs: alt.cs || title.cs, en: alt.en || title.en },
    category: input.category,
    duration: input.duration,
    difficulty,
    tip,
  };
}

const credit = (c = {}) => ({
  author: cleanText(c.author, 120) || 'Drawing Club Prague',
  license: cleanText(c.license, 200),
  ...(c.aiGenerated ? { aiGenerated: true } : {}),
});

const imageFile = (id) => `/poses/${id}-${Date.now().toString(36)}.jpg`;

/** Only delete images this admin created (never the original placeholder SVGs by accident of path). */
const deletable = (file) => typeof file === 'string' && /^\/poses\/[a-z0-9-]+\.(jpg|svg)$/.test(file);

export function GET(request) {
  return handle(request, readPoses);
}

/** Create: { pose: {...fields, credit}, image: { base64 } } — added to the end of the library. */
export function POST(request) {
  return handle(request, async () => {
    const { pose: input = {}, image } = await request.json();
    if (!image || typeof image.base64 !== 'string' || image.base64.length < 100) throw new HttpError(400, 'Chybí obrázek.');
    const poses = await readPoses();
    const f = fields(input);
    const id = uniqueId(slugify(f.title.en || f.title.cs), poses);
    const file = imageFile(id);
    const pose = { id, ...f, image: file, credit: credit(input.credit) };
    // keep key order consistent with the rest of the file
    const ordered = {
      id,
      title: pose.title,
      image: pose.image,
      imageAlt: pose.imageAlt,
      category: pose.category,
      duration: pose.duration,
      difficulty: pose.difficulty,
      tip: pose.tip,
      credit: pose.credit,
    };
    poses.push(ordered);
    await commit([{ path: `public${file}`, base64: image.base64 }, jsonChange(DATA, poses)], `Pózy: přidána „${f.title.cs}“`);
    return poses;
  });
}

/**
 * Update one pose: { id, pose: {...fields, credit}, image?: { base64 } }
 * or reorder:      { order: [ids...] }
 */
export function PUT(request) {
  return handle(request, async () => {
    const body = await request.json();
    const poses = await readPoses();

    if (Array.isArray(body.order)) {
      const byId = new Map(poses.map((p) => [p.id, p]));
      const ordered = [];
      for (const id of body.order) {
        const p = byId.get(id);
        if (p) {
          ordered.push(p);
          byId.delete(id);
        }
      }
      const next = [...ordered, ...byId.values()];
      await commit([jsonChange(DATA, next)], 'Pózy: nové pořadí');
      return next;
    }

    const i = poses.findIndex((p) => p.id === body.id);
    if (i === -1) throw new HttpError(404, 'Póza nenalezena.');
    const current = poses[i];
    const f = fields(body.pose || {});
    const changes = [];
    let image = current.image;
    let nextCredit = current.credit?.placeholder && !body.image ? current.credit : credit(body.pose?.credit);
    if (body.image) {
      if (typeof body.image.base64 !== 'string' || body.image.base64.length < 100) throw new HttpError(400, 'Neplatný obrázek.');
      image = imageFile(current.id);
      changes.push({ path: `public${image}`, base64: body.image.base64 });
      if (deletable(current.image)) changes.push({ path: `public${current.image}`, delete: true });
      nextCredit = credit(body.pose?.credit);
    }
    poses[i] = {
      id: current.id,
      title: f.title,
      image,
      imageAlt: f.imageAlt,
      category: f.category,
      duration: f.duration,
      difficulty: f.difficulty,
      tip: f.tip,
      credit: nextCredit,
    };
    changes.push(jsonChange(DATA, poses));
    await commit(changes, `Pózy: upravena „${f.title.cs}“`);
    return poses;
  });
}

/** Delete: { id } */
export function DELETE(request) {
  return handle(request, async () => {
    const { id } = await request.json();
    const poses = await readPoses();
    const pose = poses.find((p) => p.id === id);
    if (!pose) return poses;
    if (poses.length <= 1) throw new HttpError(400, 'Knihovna musí mít aspoň jednu pózu.');
    const next = poses.filter((p) => p.id !== id);
    const changes = [jsonChange(DATA, next)];
    if (deletable(pose.image)) changes.push({ path: `public${pose.image}`, delete: true });
    await commit(changes, `Pózy: smazána „${pose.title?.cs ?? id}“`);
    return next;
  });
}

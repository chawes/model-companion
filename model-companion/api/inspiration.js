/**
 * Model Companion — inspiration board admin API (Vercel Function).
 *
 * Saves images and their order straight into the GitHub repository,
 * so Vercel redeploys the site with the change (≈1 minute).
 *
 * Required environment variables (Vercel → Project → Settings → Environment Variables):
 *   ADMIN_PASSWORD  password for /admin
 *   GITHUB_TOKEN    fine-grained token with "Contents: Read and write" on the repository
 * Optional:
 *   GITHUB_REPO     default "chawes/model-companion"
 *   GITHUB_BRANCH   default "main"
 *   GITHUB_ROOT     folder of the app inside the repo, default "model-companion" ("" for repo root)
 */

const REPO = process.env.GITHUB_REPO || 'chawes/model-companion';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const ROOT = (process.env.GITHUB_ROOT ?? 'model-companion').replace(/^\/+|\/+$/g, '');
const INDEX = 'public/inspiration/index.json';
const MAX_ITEMS = 2000;

const repoPath = (rel) => (ROOT ? `${ROOT}/${rel}` : rel);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function gh(path, init = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'model-companion-admin',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new HttpError(res.status, `GitHub ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.status === 204 ? null : res.json();
}

async function readIndex() {
  try {
    const file = await gh(`/contents/${repoPath(INDEX)}?ref=${encodeURIComponent(BRANCH)}`);
    const parsed = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
    return Array.isArray(parsed.items) ? parsed : { items: [] };
  } catch (e) {
    if (e instanceof HttpError && e.status === 404) return { items: [] };
    throw e;
  }
}

/** One commit with any number of added/changed/deleted files. */
async function commit(changes, message, attempt = 0) {
  const ref = await gh(`/git/ref/heads/${encodeURIComponent(BRANCH)}`);
  const head = ref.object.sha;
  const base = await gh(`/git/commits/${head}`);
  const tree = [];
  for (const c of changes) {
    if (c.delete) {
      tree.push({ path: repoPath(c.path), mode: '100644', type: 'blob', sha: null });
    } else {
      const content = c.base64 ?? Buffer.from(c.text, 'utf8').toString('base64');
      const blob = await gh('/git/blobs', { method: 'POST', body: JSON.stringify({ content, encoding: 'base64' }) });
      tree.push({ path: repoPath(c.path), mode: '100644', type: 'blob', sha: blob.sha });
    }
  }
  const newTree = await gh('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: base.tree.sha, tree }) });
  const newCommit = await gh('/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [head] }),
  });
  try {
    await gh(`/git/refs/heads/${encodeURIComponent(BRANCH)}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: newCommit.sha, force: false }),
    });
  } catch (e) {
    // someone else committed in between — retry once on top of the new head
    if (attempt === 0 && e instanceof HttpError && e.status === 422) return commit(changes, message, 1);
    throw e;
  }
}

const indexChange = (index) => ({ path: INDEX, text: JSON.stringify(index, null, 2) + '\n' });

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const cleanSource = (s) => (typeof s === 'string' ? s.trim().slice(0, 300) : '');

function checkAuth(request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.GITHUB_TOKEN) {
    throw new HttpError(500, 'Chybí nastavení ADMIN_PASSWORD nebo GITHUB_TOKEN ve Vercelu.');
  }
  const given = request.headers.get('x-admin-password') || '';
  const expected = process.env.ADMIN_PASSWORD;
  let diff = given.length ^ expected.length;
  for (let i = 0; i < Math.max(given.length, expected.length); i++) {
    diff |= (given.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
  }
  if (diff !== 0) throw new HttpError(401, 'Špatné heslo.');
}

async function handle(request, fn) {
  try {
    checkAuth(request);
    return json(await fn());
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    return json({ error: e instanceof Error ? e.message : 'Neznámá chyba' }, status >= 400 && status < 600 ? status : 500);
  }
}

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
    changes.push(indexChange(index));
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
    // never drop items the client didn't know about
    index.items = [...ordered, ...byId.values()];
    await commit([indexChange(index)], 'Inspirace: pořadí a zdroje');
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
      [...removed.map((i) => ({ path: `public${i.file}`, delete: true })), indexChange(index)],
      `Inspirace: smazáno ${removed.length} obr.`,
    );
    return index;
  });
}

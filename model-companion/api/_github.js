/**
 * Shared helpers for the admin API functions (not a route: files starting with "_" are ignored by Vercel).
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   ADMIN_PASSWORD, GITHUB_TOKEN (required)
 *   GITHUB_REPO (default chawes/model-companion), GITHUB_BRANCH (main), GITHUB_ROOT (model-companion)
 */

export const REPO = process.env.GITHUB_REPO || 'chawes/model-companion';
export const BRANCH = process.env.GITHUB_BRANCH || 'main';
const ROOT = (process.env.GITHUB_ROOT ?? 'model-companion').replace(/^\/+|\/+$/g, '');

export const repoPath = (rel) => (ROOT ? `${ROOT}/${rel}` : rel);

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export async function gh(path, init = {}) {
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

/** Read and parse a JSON file from the repo; returns `fallback` if it doesn't exist. */
export async function readJson(rel, fallback) {
  try {
    const file = await gh(`/contents/${repoPath(rel)}?ref=${encodeURIComponent(BRANCH)}`);
    return JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
  } catch (e) {
    if (e instanceof HttpError && e.status === 404) return fallback;
    throw e;
  }
}

/**
 * One commit with any number of changes:
 *   { path, text } | { path, base64 } | { path, delete: true }   (paths relative to the app folder)
 */
export async function commit(changes, message, attempt = 0) {
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
    if (attempt === 0 && e instanceof HttpError && e.status === 422) return commit(changes, message, 1);
    throw e;
  }
}

export const jsonChange = (path, data) => ({ path, text: JSON.stringify(data, null, 2) + '\n' });

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

/** Wrap a handler: password check + JSON response + error mapping. */
export async function handle(request, fn) {
  try {
    checkAuth(request);
    return json(await fn());
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    return json({ error: e instanceof Error ? e.message : 'Neznámá chyba' }, status >= 400 && status < 600 ? status : 500);
  }
}

export const cleanText = (s, max = 600) => (typeof s === 'string' ? s.trim().slice(0, max) : '');

import { useCallback, useMemo, useSyncExternalStore } from 'react';

/**
 * A tiny localStorage-backed set of string IDs, shared across components
 * and kept in sync between browser tabs. No registration needed —
 * everything stays on the visitor's device.
 */
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; ids: string[] }>();

function read(key: string): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // storage can be unavailable (private mode, embedded contexts)
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.ids;
  let ids: string[] = [];
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) ids = parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    ids = [];
  }
  cache.set(key, { raw, ids });
  return ids;
}

function write(key: string, ids: string[]) {
  const raw = JSON.stringify(ids);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    // ignore quota / unavailable storage; keep in-memory state
  }
  cache.set(key, { raw, ids });
  listeners.get(key)?.forEach((l) => l());
}

function subscribe(key: string, listener: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.get(key)?.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const EMPTY: string[] = [];

export function useStoredSet(key: string) {
  const ids = useSyncExternalStore(
    useCallback((l: () => void) => subscribe(key, l), [key]),
    () => read(key),
    () => EMPTY,
  );

  const set = useMemo(() => new Set(ids), [ids]);

  const has = useCallback((id: string) => set.has(id), [set]);
  const add = useCallback((id: string) => {
    const cur = read(key);
    if (!cur.includes(id)) write(key, [id, ...cur]);
  }, [key]);
  const remove = useCallback((id: string) => write(key, read(key).filter((x) => x !== id)), [key]);
  const toggle = useCallback(
    (id: string) => (read(key).includes(id) ? remove(id) : add(id)),
    [key, add, remove],
  );
  const clear = useCallback(() => write(key, []), [key]);

  return { ids, has, add, remove, toggle, clear };
}

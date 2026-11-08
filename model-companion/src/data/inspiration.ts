import { useEffect, useState } from 'react';

export interface InspirationItem {
  id: string;
  /** path under /public, e.g. "/inspiration/abc.jpg" */
  file: string;
  w: number;
  h: number;
  /** optional author / source credit */
  source?: string;
}

/**
 * The board lives in public/inspiration/index.json and is edited from /admin.
 * It is fetched at runtime so new images appear without rebuilding the app code.
 */
export function useInspiration() {
  const [items, setItems] = useState<InspirationItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/inspiration/index.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { items?: InspirationItem[] }) => alive && setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => {
        if (alive) {
          setItems([]);
          setFailed(true);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  return { items, failed };
}

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filterPoses, POSES, type PoseFilter } from '../data/poses';
import { isCategory, isDuration } from '../data/taxonomy';
import type { PoseCategory, PoseDuration } from '../types';

/**
 * Filters live in the URL (?category=seated&duration=10) so a filtered
 * view can be bookmarked, shared, and survives navigating to a pose and back.
 */
export function usePoseFilters() {
  const [params, setParams] = useSearchParams();

  const filter: PoseFilter = useMemo(() => {
    const c = params.get('category');
    const d = params.get('duration');
    return { category: isCategory(c) ? c : null, duration: isDuration(d) ? d : null };
  }, [params]);

  const results = useMemo(() => filterPoses(POSES, filter), [filter]);

  const update = useCallback(
    (key: 'category' | 'duration', value: string | null) => {
      const next = new URLSearchParams(params);
      if (value) next.set(key, value);
      else next.delete(key);
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  return {
    filter,
    results,
    query: params.toString() ? `?${params.toString()}` : '',
    setCategory: (c: PoseCategory | null) => update('category', c),
    setDuration: (d: PoseDuration | null) => update('duration', d),
    clear: () => setParams(new URLSearchParams(), { replace: true }),
    active: Boolean(filter.category || filter.duration),
  };
}

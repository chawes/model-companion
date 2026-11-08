import { useMemo } from 'react';
import { POSES } from '../data/poses';
import { useStoredSet } from './useStoredSet';

const KEY = 'model-companion:saved-poses:v1';

/** Bookmarked poses, persisted in localStorage. Newest first. */
export function useSavedPoses() {
  const store = useStoredSet(KEY);
  const poses = useMemo(
    () => store.ids.map((id) => POSES.find((p) => p.id === id)).filter((p) => p !== undefined),
    [store.ids],
  );
  return {
    savedIds: store.ids,
    savedPoses: poses,
    isSaved: store.has,
    toggleSaved: store.toggle,
    removeSaved: store.remove,
    clearSaved: store.clear,
  };
}

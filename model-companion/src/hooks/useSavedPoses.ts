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

const READ_KEY = 'model-companion:read-lessons:v1';

/** Guide lessons the visitor has opened — a light progress indicator. */
export function useReadLessons() {
  const store = useStoredSet(READ_KEY);
  return { isRead: store.has, markRead: store.add };
}

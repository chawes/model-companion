import type { Pose, PoseCategory, PoseDuration } from '../types';
import raw from './poses.json';

/**
 * The pose library. Edit poses.json to add or change poses —
 * see README → "Adding poses".
 */
export const POSES: Pose[] = raw as Pose[];

export const getPose = (id: string | undefined) => POSES.find((p) => p.id === id);

/** 1-based plate number, used for the editorial "No. 01" labels. */
export const plateNumber = (pose: Pose) => String(POSES.indexOf(pose) + 1).padStart(2, '0');

export interface PoseFilter {
  category: PoseCategory | null;
  duration: PoseDuration | null;
}

export const filterPoses = (poses: Pose[], f: PoseFilter) =>
  poses.filter((p) => (!f.category || p.category === f.category) && (!f.duration || p.duration === f.duration));

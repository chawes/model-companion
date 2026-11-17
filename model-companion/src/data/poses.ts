import type { Difficulty, Pose, PoseCategory, PoseDuration } from '../types';
import raw from './poses.json';

/** The pose library. Edit poses.json to add or change poses — see README. */
export const POSES: Pose[] = raw as Pose[];

export const getPose = (id: string | undefined) => POSES.find((p) => p.id === id);

/** 1-based number in library order, shown as "No. 01". */
export const plateNumber = (pose: Pose) => String(POSES.indexOf(pose) + 1).padStart(2, '0');

export const CATEGORIES: { id: PoseCategory; key: 'catStanding' | 'catSeated' | 'catFloor' | 'catAction' }[] = [
  { id: 'standing', key: 'catStanding' },
  { id: 'seated', key: 'catSeated' },
  { id: 'floor', key: 'catFloor' },
  { id: 'action', key: 'catAction' },
];

export const DURATIONS: PoseDuration[] = ['1-2', '3-5', '10', '15-20'];
export const DIFFICULTIES: Difficulty[] = [1, 2, 3];

export const isCategory = (v: string | null): v is PoseCategory => CATEGORIES.some((c) => c.id === v);
export const isDuration = (v: string | null): v is PoseDuration => DURATIONS.includes(v as PoseDuration);
export const toDifficulty = (v: string | null): Difficulty | null =>
  v === '1' || v === '2' || v === '3' ? (Number(v) as Difficulty) : null;

export const categoryKey = (c: PoseCategory) => CATEGORIES.find((x) => x.id === c)!.key;
export const durationText = (d: PoseDuration) => d.replace('-', '–');

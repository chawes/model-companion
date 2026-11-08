import type { Pose, PoseCategory } from '../types';
import raw from './poses.json';

/** The pose library. Edit poses.json to add or change poses — see README. */
export const POSES: Pose[] = raw as Pose[];

export const getPose = (id: string | undefined) => POSES.find((p) => p.id === id);

export const CATEGORIES: { id: PoseCategory; key: 'catStanding' | 'catSeated' | 'catFloor' | 'catAction' }[] = [
  { id: 'standing', key: 'catStanding' },
  { id: 'seated', key: 'catSeated' },
  { id: 'floor', key: 'catFloor' },
  { id: 'action', key: 'catAction' },
];

export const isCategory = (v: string | null): v is PoseCategory => CATEGORIES.some((c) => c.id === v);

export const durationText = (d: Pose['duration']) => d.replace('-', '–');

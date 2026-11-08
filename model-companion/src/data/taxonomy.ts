import type { Difficulty, PoseCategory, PoseDuration } from '../types';

export const CATEGORIES: { id: PoseCategory; label: string }[] = [
  { id: 'standing', label: 'Standing' },
  { id: 'seated', label: 'Seated' },
  { id: 'floor', label: 'Floor / Reclining' },
  { id: 'dynamic', label: 'Dynamic' },
  { id: 'gestural', label: 'Gestural' },
  { id: 'relaxed', label: 'Relaxed' },
  { id: 'dramatic', label: 'Dramatic' },
];

export const DURATIONS: { id: PoseDuration; label: string; short: string }[] = [
  { id: '1-2', label: '1–2 minutes', short: '1–2 min' },
  { id: '3-5', label: '3–5 minutes', short: '3–5 min' },
  { id: '10', label: '10 minutes', short: '10 min' },
  { id: '15-20', label: '15–20 minutes', short: '15–20 min' },
];

export const DIFFICULTY: Record<Difficulty, { label: string; description: string }> = {
  1: { label: 'Easy hold', description: 'Well supported, comfortable for most people.' },
  2: { label: 'Moderate', description: 'Some muscular effort or balance involved.' },
  3: { label: 'Demanding', description: 'Strength or balance needed — best kept short.' },
};

export const categoryLabel = (id: PoseCategory) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
export const durationLabel = (id: PoseDuration) => DURATIONS.find((d) => d.id === id)?.short ?? id;

export const isCategory = (v: string | null): v is PoseCategory => CATEGORIES.some((c) => c.id === v);
export const isDuration = (v: string | null): v is PoseDuration => DURATIONS.some((d) => d.id === v);

export type PoseCategory =
  | 'standing'
  | 'seated'
  | 'floor'
  | 'dynamic'
  | 'gestural'
  | 'relaxed'
  | 'dramatic';

export type PoseDuration = '1-2' | '3-5' | '10' | '15-20';

/** 1 = easy to hold, 2 = moderate, 3 = demanding */
export type Difficulty = 1 | 2 | 3;

export interface ImageCredit {
  /** Who made the image (photographer, illustrator, studio). */
  author: string;
  /** Licence or permission under which the image is used. Never guess this. */
  license: string;
  /** Optional link to the source or licence. */
  url?: string;
  /** True for temporary placeholder artwork that should be replaced. */
  placeholder?: boolean;
}

export interface Pose {
  id: string;
  title: string;
  /** Path relative to /public, e.g. "/poses/contrapposto-rest.svg" */
  image: string;
  /** Short description of the image for screen readers. */
  imageAlt: string;
  category: PoseCategory;
  duration: PoseDuration;
  difficulty: Difficulty;
  /** One-line posing tip shown on cards and at the top of the detail view. */
  tip: string;
  /** Longer practical advice, shown as a list on the detail view. */
  advice: string[];
  tags?: string[];
  credit: ImageCredit;
}

export interface GuideView {
  label: string;
  image: string;
  alt: string;
  caption: string;
}

export interface GuideLesson {
  id: string;
  number: number;
  title: string;
  summary: string;
  body: string[];
  /** Two contrasting illustrations the reader can toggle between. */
  views: [GuideView, GuideView];
  takeaway: string;
}

export interface PrepSection {
  id: string;
  title: string;
  icon: PrepIcon;
  intro?: string;
  items: string[];
  note?: string;
}

export type PrepIcon = 'structure' | 'bring' | 'timing' | 'breaks' | 'communication' | 'consent';

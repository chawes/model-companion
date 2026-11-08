export type Lang = 'cs' | 'en';

/** Text in both languages. Czech is the primary language. */
export type Localized = Record<Lang, string>;

export type PoseCategory = 'standing' | 'seated' | 'floor' | 'action';

export type PoseDuration = '1-2' | '3-5' | '10' | '15-20';

export interface ImageCredit {
  /** Who made the image (photographer, illustrator, tool). */
  author: string;
  /** Licence or permission under which the image is used. Never guess this. */
  license: string;
  url?: string;
  /** Temporary placeholder artwork — shows a generic note instead of author/licence. */
  placeholder?: boolean;
  /** Image generated with AI — shown openly in the credit line. */
  aiGenerated?: boolean;
}

export interface Pose {
  id: string;
  title: Localized;
  /** Path relative to /public, e.g. "/poses/contrapposto-rest.svg" */
  image: string;
  imageAlt: Localized;
  category: PoseCategory;
  duration: PoseDuration;
  /** One short, practical tip. */
  tip: Localized;
  credit: ImageCredit;
}

export interface GuideView {
  label: Localized;
  image: string;
  alt: Localized;
  caption: Localized;
}

export interface GuideLesson {
  id: string;
  title: Localized;
  text: Localized;
  /** Two contrasting illustrations the reader can toggle between. */
  views: [GuideView, GuideView];
  takeaway: Localized;
}

export interface PrepBlock {
  id: string;
  title: Localized;
  items: Localized[];
}

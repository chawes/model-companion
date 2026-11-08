import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { plateNumber } from '../data/poses';
import { categoryLabel, durationLabel } from '../data/taxonomy';
import type { Pose } from '../types';
import { BookmarkButton } from './BookmarkButton';
import { DifficultyMeter } from './DifficultyMeter';
import { PoseImage } from './PoseImage';

interface Props {
  pose: Pose;
  /** query string to carry into the detail view, so prev/next follows the filtered set */
  query?: string;
  index?: number;
}

export function PoseCard({ pose, query = '', index = 0 }: Props) {
  return (
    <article
      className="group relative animate-enter"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <Link
        to={`/poses/${pose.id}${query}`}
        className="block rounded-[3px] focus-visible:outline-offset-4"
        aria-label={`${pose.title} — ${categoryLabel(pose.category)}, ${durationLabel(pose.duration)}`}
      >
        <PoseImage
          pose={pose}
          className="aspect-[4/5] rounded-[3px] ring-1 ring-ink/5 transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:-translate-y-1"
        />
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">
              No. {plateNumber(pose)} · {categoryLabel(pose.category)}
            </p>
            <h3 className="mt-1 font-display text-[1.35rem] leading-[1.15] md:text-[1.5rem]">{pose.title}</h3>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-4 text-[0.8rem] text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} aria-hidden />
            {durationLabel(pose.duration)}
          </span>
          <DifficultyMeter value={pose.difficulty} showLabel />
        </div>
      </Link>
      <BookmarkButton poseId={pose.id} poseTitle={pose.title} className="absolute right-2.5 top-2.5" />
    </article>
  );
}

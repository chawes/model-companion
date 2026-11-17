import { Link } from 'react-router-dom';
import { categoryKey, durationText, plateNumber } from '../data/poses';
import { useLang } from '../i18n/LangContext';
import type { Pose } from '../types';
import { BookmarkButton } from './BookmarkButton';
import { DifficultyDots } from './DifficultyDots';
import { PoseImage } from './PoseImage';

export const tagClass = 'border border-fg/40 px-1.5 py-[1px] text-[0.66rem] font-medium uppercase tracking-wide text-fg/85 rounded-[3px]';

export function PoseCard({ pose, query = '', index = 0 }: { pose: Pose; query?: string; index?: number }) {
  const { l, t } = useLang();
  return (
    <article
      className="group relative animate-enter overflow-hidden rounded-md border border-line bg-surface transition-colors hover:border-fg/40"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <Link to={`/poses/${pose.id}${query}`} className="block focus-visible:outline-offset-[-2px]">
        <PoseImage pose={pose} className="aspect-[4/3]" />
        <div className="px-3.5 pb-3.5 pt-3 md:px-4 md:pb-4">
          <h3 className="font-display text-[1rem] leading-tight md:text-[1.1rem]">{l(pose.title)}</h3>
          <div className="mt-2.5 flex items-center gap-2">
            <span className={tagClass}>{t(categoryKey(pose.category))}</span>
            <span className={tagClass}>
              {durationText(pose.duration)} {t('minutes')}
            </span>
            <DifficultyDots value={pose.difficulty} className="ml-1 text-fg" />
            <span className="ml-auto hidden text-[0.75rem] text-faint sm:inline">No. {plateNumber(pose)}</span>
          </div>
        </div>
      </Link>
      <BookmarkButton poseId={pose.id} className="absolute right-2.5 top-2.5" />
    </article>
  );
}

import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { durationText } from '../data/poses';
import { useLang } from '../i18n/LangContext';
import type { Pose } from '../types';
import { BookmarkButton } from './BookmarkButton';
import { PoseImage } from './PoseImage';

export function PoseCard({ pose, query = '', index = 0 }: { pose: Pose; query?: string; index?: number }) {
  const { l, t } = useLang();
  return (
    <article className="group relative animate-enter" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
      <Link to={`/poses/${pose.id}${query}`} className="block focus-visible:outline-offset-4">
        <PoseImage pose={pose} className="aspect-[4/5] outline outline-1 -outline-offset-1 outline-transparent transition-[outline-color] duration-300 group-hover:outline-red-bright" />
        <div className="mt-3 flex flex-col items-start gap-2 border-t border-line pt-3 lg:flex-row lg:justify-between lg:gap-3">
          <h3 className="text-[0.98rem] font-semibold leading-snug transition-colors group-hover:text-red-bright md:text-[1.05rem]">{l(pose.title)}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 border border-line px-1.5 py-0.5 text-[0.72rem] text-muted">
            <Clock size={11} aria-hidden />
            {durationText(pose.duration)} {t('minutes')}
          </span>
        </div>
      </Link>
      <BookmarkButton poseId={pose.id} className="absolute right-2.5 top-2.5" />
    </article>
  );
}

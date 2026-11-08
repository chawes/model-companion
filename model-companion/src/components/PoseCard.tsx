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
      <Link to={`/poses/${pose.id}${query}`} className="block rounded-[3px] focus-visible:outline-offset-4">
        <PoseImage
          pose={pose}
          className="aspect-[4/5] rounded-[3px] ring-1 ring-ink/5 transition-transform duration-700 group-hover:-translate-y-1"
        />
        <h3 className="mt-3 font-display text-[1.3rem] leading-[1.15] md:text-[1.45rem]">{l(pose.title)}</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-[0.8rem] text-ink-soft">
          <Clock size={13} aria-hidden />
          {durationText(pose.duration)} {t('minutes')}
        </p>
      </Link>
      <BookmarkButton poseId={pose.id} className="absolute right-2.5 top-2.5" />
    </article>
  );
}

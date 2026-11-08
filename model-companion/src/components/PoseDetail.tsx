import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { durationText } from '../data/poses';
import { useLang } from '../i18n/LangContext';
import type { Pose } from '../types';
import { BookmarkButton } from './BookmarkButton';
import { PoseImage } from './PoseImage';

interface Props {
  pose: Pose;
  prev?: Pose;
  next?: Pose;
  /** current filter query, carried through navigation */
  query: string;
}

export function PoseDetail({ pose, prev, next, query }: Props) {
  const { l, t } = useLang();
  const navigate = useNavigate();

  // ← / → keys move through the (filtered) library
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prev) navigate(`/poses/${prev.id}${query}`);
      if (e.key === 'ArrowRight' && next) navigate(`/poses/${next.id}${query}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, query, navigate]);

  const credit = pose.credit.placeholder
    ? t('placeholderCredit')
    : [pose.credit.aiGenerated ? t('aiCredit') : '', pose.credit.author, pose.credit.license].filter(Boolean).join(' · ');

  return (
    <article className="mx-auto max-w-5xl px-5 pt-5 md:px-8 md:pt-10">
      <Link to={`/${query}`} className="mb-5 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink md:mb-8">
        <ArrowLeft size={16} aria-hidden /> {t('back')}
      </Link>

      <div className="grid gap-7 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-start md:gap-12">
        <figure>
          <PoseImage pose={pose} priority className="aspect-[4/5] rounded-[3px] ring-1 ring-ink/5" />
          <figcaption className="mt-2 text-[0.72rem] text-ink-faint">{credit}</figcaption>
        </figure>

        <div className="animate-enter md:sticky md:top-24">
          <h1 className="font-display text-[2.5rem] leading-[1.02] tracking-tight md:text-[3.2rem]">{l(pose.title)}</h1>
          <p className="mt-4 inline-flex items-center gap-2 text-[0.95rem] text-ink-soft">
            <Clock size={16} aria-hidden />
            {t('suggested')}: <span className="text-ink">{durationText(pose.duration)} {t('minutes')}</span>
          </p>
          <p className="mt-6 border-l-2 border-sanguine pl-5 font-display text-[1.4rem] italic leading-snug">{l(pose.tip)}</p>
          <BookmarkButton poseId={pose.id} variant="full" className="mt-8 w-full" />
          <p className="mt-3 text-center text-[0.78rem] text-ink-faint">{t('suggestionNote')}</p>
        </div>
      </div>

      <nav aria-label={t('navPoses')} className="mt-12 grid grid-cols-2 border-t hairline md:mt-16">
        {prev ? (
          <Link to={`/poses/${prev.id}${query}`} className="group flex flex-col gap-1 py-5 pr-4">
            <span className="eyebrow inline-flex items-center gap-1.5">
              <ArrowLeft size={13} aria-hidden /> {t('previous')}
            </span>
            <span className="font-display text-xl leading-tight">{l(prev.title)}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/poses/${next.id}${query}`} className="group flex flex-col items-end gap-1 border-l hairline py-5 pl-4 text-right">
            <span className="eyebrow inline-flex items-center gap-1.5">
              {t('next')} <ArrowRight size={13} aria-hidden />
            </span>
            <span className="font-display text-xl leading-tight">{l(next.title)}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

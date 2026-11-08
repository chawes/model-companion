import { ArrowLeft, ArrowRight, Clock, Info } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { plateNumber } from '../data/poses';
import { categoryLabel, DIFFICULTY, durationLabel } from '../data/taxonomy';
import type { Pose } from '../types';
import { BookmarkButton } from './BookmarkButton';
import { DifficultyMeter } from './DifficultyMeter';
import { PoseImage } from './PoseImage';

interface Props {
  pose: Pose;
  prev?: Pose;
  next?: Pose;
  /** query string of the current filter, carried through navigation */
  query: string;
  position: { index: number; total: number };
}

export function PoseDetail({ pose, prev, next, query, position }: Props) {
  const navigate = useNavigate();

  // ← / → keys move through the (filtered) library
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowLeft' && prev) navigate(`/poses/${prev.id}${query}`);
      if (e.key === 'ArrowRight' && next) navigate(`/poses/${next.id}${query}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, query, navigate]);

  const diff = DIFFICULTY[pose.difficulty];

  return (
    <article className="mx-auto max-w-6xl px-5 pt-5 md:px-8 md:pt-10">
      <div className="mb-5 flex items-center justify-between md:mb-8">
        <Link
          to={`/poses${query}`}
          className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden /> Pose Library
        </Link>
        <span className="eyebrow">
          {position.index + 1} / {position.total}
        </span>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-12 lg:gap-16">
        <figure className="md:sticky md:top-24 md:self-start">
          <PoseImage pose={pose} priority className="aspect-[4/5] rounded-[3px] ring-1 ring-ink/5" />
          <figcaption className="mt-3 flex items-start gap-2 text-[0.75rem] leading-snug text-ink-faint">
            <Info size={13} className="mt-[3px] shrink-0" aria-hidden />
            <span>
              {pose.credit.author}. {pose.credit.license}
              {pose.credit.url && (
                <>
                  {' '}
                  <a href={pose.credit.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                    Source
                  </a>
                </>
              )}
            </span>
          </figcaption>
        </figure>

        <div className="animate-enter">
          <p className="eyebrow">
            Plate {plateNumber(pose)} · {categoryLabel(pose.category)}
          </p>
          <h1 className="mt-3 font-display text-[2.6rem] leading-[1.02] tracking-tight md:text-[3.4rem]">{pose.title}</h1>

          <dl className="mt-7 divide-y divide-line border-y hairline text-[0.92rem]">
            <div className="flex items-center justify-between py-3">
              <dt className="text-ink-soft">Category</dt>
              <dd>{categoryLabel(pose.category)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-ink-soft">Suggested duration</dt>
              <dd className="inline-flex items-center gap-1.5">
                <Clock size={14} aria-hidden /> {durationLabel(pose.duration)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-ink-soft">Hold difficulty</dt>
              <dd>
                <DifficultyMeter value={pose.difficulty} showLabel />
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-[0.78rem] text-ink-faint">
            {diff.description} Durations are suggestions based on stability and comfort.
          </p>

          <blockquote className="mt-8 border-l-2 border-sanguine pl-5">
            <p className="font-display text-[1.45rem] italic leading-snug">{pose.tip}</p>
          </blockquote>

          <section className="mt-8" aria-labelledby="advice-heading">
            <h2 id="advice-heading" className="eyebrow">
              Practical advice
            </h2>
            <ol className="mt-3 space-y-3">
              {pose.advice.map((a, i) => (
                <li key={i} className="flex gap-4 text-[0.95rem] leading-relaxed">
                  <span className="mt-[3px] font-mono text-[0.72rem] text-sanguine">{String(i + 1).padStart(2, '0')}</span>
                  <span>{a}</span>
                </li>
              ))}
            </ol>
          </section>

          {pose.tags && pose.tags.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-2" aria-label="Tags">
              {pose.tags.map((t) => (
                <li key={t} className="rounded-full bg-paper-deep px-3 py-1 text-[0.78rem] text-ink-soft">
                  {t}
                </li>
              ))}
            </ul>
          )}

          <BookmarkButton poseId={pose.id} poseTitle={pose.title} variant="full" className="mt-8 w-full" />
          <p className="mt-3 text-center text-[0.78rem] text-ink-faint">
            A suggestion, not an instruction — adapt it to your body.
          </p>
        </div>
      </div>

      <nav aria-label="More poses" className="mt-14 grid grid-cols-2 border-t hairline md:mt-20">
        {prev ? (
          <Link to={`/poses/${prev.id}${query}`} className="group flex flex-col gap-1 py-6 pr-4">
            <span className="eyebrow inline-flex items-center gap-1.5">
              <ArrowLeft size={13} aria-hidden className="transition-transform group-hover:-translate-x-1" /> Previous
            </span>
            <span className="font-display text-xl leading-tight md:text-2xl">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/poses/${next.id}${query}`}
            className="group flex flex-col items-end gap-1 border-l hairline py-6 pl-4 text-right"
          >
            <span className="eyebrow inline-flex items-center gap-1.5">
              Next <ArrowRight size={13} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </span>
            <span className="font-display text-xl leading-tight md:text-2xl">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

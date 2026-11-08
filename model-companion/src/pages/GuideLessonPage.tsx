import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CompareFigure } from '../components/CompareFigure';
import { getLesson, LESSONS } from '../data/guide';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useReadLessons } from '../hooks/useSavedPoses';
import { NotFoundPage } from './NotFoundPage';

export function GuideLessonPage() {
  const { lessonId } = useParams();
  const lesson = getLesson(lessonId);
  const { markRead } = useReadLessons();
  useDocumentTitle(lesson?.title);

  useEffect(() => {
    if (lesson) markRead(lesson.id);
  }, [lesson, markRead]);

  if (!lesson) return <NotFoundPage />;

  const i = LESSONS.indexOf(lesson);
  const prev = LESSONS[i - 1];
  const next = LESSONS[i + 1];

  return (
    <article className="mx-auto max-w-6xl px-5 pt-5 md:px-8 md:pt-10">
      <div className="mb-6 flex items-center justify-between md:mb-10">
        <Link to="/guide" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
          <ArrowLeft size={16} aria-hidden /> All lessons
        </Link>
        <ol className="flex gap-1.5" aria-label="Lesson progress">
          {LESSONS.map((l) => (
            <li key={l.id}>
              <Link
                to={`/guide/${l.id}`}
                aria-label={`Lesson ${l.number}: ${l.title}`}
                aria-current={l.id === lesson.id ? 'step' : undefined}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  l.id === lesson.id ? 'w-6 bg-sanguine' : 'w-1.5 bg-line hover:bg-ink-faint'
                }`}
              />
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-10 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-14 lg:gap-20">
        <div className="animate-enter md:order-1">
          <p className="eyebrow">
            Lesson {String(lesson.number).padStart(2, '0')} / {String(LESSONS.length).padStart(2, '0')}
          </p>
          <h1 className="mt-3 font-display text-[2.6rem] leading-[1.02] tracking-tight md:text-[3.6rem]">{lesson.title}</h1>
          <p className="mt-5 font-display text-[1.4rem] italic leading-snug text-ink-soft">{lesson.summary}</p>
          <div className="mt-6 space-y-4 text-[1rem] leading-relaxed">
            {lesson.body.map((p, k) => (
              <p key={k}>{p}</p>
            ))}
          </div>
          <aside className="mt-8 rounded-[4px] bg-sanguine-soft/60 p-5 md:p-6" aria-label="Takeaway">
            <p className="eyebrow text-sanguine">Takeaway</p>
            <p className="mt-2 font-display text-[1.45rem] leading-snug">{lesson.takeaway}</p>
          </aside>
        </div>
        <div className="md:order-2 md:sticky md:top-24 md:self-start">
          <CompareFigure key={lesson.id} views={lesson.views} />
        </div>
      </div>

      <nav aria-label="Lessons" className="mt-14 grid grid-cols-2 border-t hairline md:mt-20">
        {prev ? (
          <Link to={`/guide/${prev.id}`} className="group flex flex-col gap-1 py-6 pr-4">
            <span className="eyebrow inline-flex items-center gap-1.5">
              <ArrowLeft size={13} aria-hidden className="transition-transform group-hover:-translate-x-1" /> Lesson {prev.number}
            </span>
            <span className="font-display text-xl leading-tight md:text-2xl">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/guide/${next.id}`} className="group flex flex-col items-end gap-1 border-l hairline py-6 pl-4 text-right">
            <span className="eyebrow inline-flex items-center gap-1.5">
              Lesson {next.number} <ArrowRight size={13} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </span>
            <span className="font-display text-xl leading-tight md:text-2xl">{next.title}</span>
          </Link>
        ) : (
          <Link to="/prep" className="group flex flex-col items-end gap-1 border-l hairline py-6 pl-4 text-right">
            <span className="eyebrow inline-flex items-center gap-1.5">
              Up next <ArrowRight size={13} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </span>
            <span className="font-display text-xl leading-tight md:text-2xl">Session prep</span>
          </Link>
        )}
      </nav>
    </article>
  );
}

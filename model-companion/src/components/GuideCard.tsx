import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { GuideLesson } from '../types';

export function GuideCard({ lesson, read }: { lesson: GuideLesson; read: boolean }) {
  return (
    <Link
      to={`/guide/${lesson.id}`}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b hairline py-6 transition-colors md:gap-8 md:py-8"
    >
      <span className="w-12 font-display text-[2.6rem] leading-none text-ink/25 transition-colors group-hover:text-sanguine md:w-16 md:text-[3.4rem]">
        {String(lesson.number).padStart(2, '0')}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="font-display text-[1.45rem] leading-tight md:text-[1.9rem]">{lesson.title}</span>
          {read && (
            <span className="inline-flex items-center gap-1 rounded-full bg-paper-deep px-2 py-0.5 text-[0.68rem] text-ink-soft">
              <Check size={11} aria-hidden /> Read
            </span>
          )}
        </span>
        <span className="mt-1 block text-[0.92rem] text-ink-soft">{lesson.summary}</span>
      </span>
      <span className="hidden size-20 overflow-hidden rounded-[3px] bg-paper-deep sm:block md:size-24">
        <img src={lesson.views[1].image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
      </span>
      <ArrowRight
        size={18}
        aria-hidden
        className="col-start-3 row-start-1 text-ink-faint transition-transform group-hover:translate-x-1 sm:hidden"
      />
    </Link>
  );
}

import {
  ArrowUpRight,
  Backpack,
  Coffee,
  ListOrdered,
  MessageCircle,
  ShieldCheck,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import { PageIntro } from '../components/ui';
import { PREP_SECTIONS } from '../data/prep';
import { SITE } from '../data/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { PrepIcon } from '../types';

const ICONS: Record<PrepIcon, LucideIcon> = {
  structure: ListOrdered,
  bring: Backpack,
  timing: Timer,
  breaks: Coffee,
  communication: MessageCircle,
  consent: ShieldCheck,
};

export function PrepPage() {
  useDocumentTitle('Session Prep');

  return (
    <>
      <PageIntro
        eyebrow="Session Prep"
        title={
          <>
            Before you <em className="text-sanguine">pose</em>
          </>
        }
      >
        Practical notes for arriving relaxed and prepared. Exact details for each session are agreed with the organizer.
      </PageIntro>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[13rem_1fr] md:gap-16 md:px-8">
        <nav aria-label="On this page" className="hidden md:block">
          <ul className="sticky top-24 space-y-2 border-l hairline">
            {PREP_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-sm text-ink-soft hover:border-ink hover:text-ink">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 md:space-y-0">
          {PREP_SECTIONS.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className="rounded-[4px] bg-paper-bright/70 p-5 ring-1 ring-ink/5 md:rounded-none md:bg-transparent md:p-0 md:py-10 md:ring-0 md:[&:not(:first-child)]:border-t md:border-line"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paper-deep text-ink">
                    <Icon size={18} strokeWidth={1.7} aria-hidden />
                  </span>
                  <div>
                    <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
                    <h2 id={`${s.id}-title`} className="font-display text-[1.7rem] leading-tight md:text-[2.1rem]">
                      {s.title}
                    </h2>
                  </div>
                </div>
                {s.intro && <p className="mt-4 text-ink-soft">{s.intro}</p>}
                <ul className="mt-4 space-y-2.5">
                  {s.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.97rem] leading-relaxed">
                      <span className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-sanguine" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {s.note && <p className="mt-4 text-[0.82rem] italic text-ink-faint">{s.note}</p>}
              </section>
            );
          })}

          <a
            href={SITE.modelingUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-6 flex items-center justify-between gap-6 rounded-[4px] bg-ink p-6 text-paper-bright transition-colors hover:bg-ink/90 md:mt-10 md:p-8"
          >
            <span>
              <span className="eyebrow text-paper-bright/60">Official information</span>
              <span className="mt-2 block font-display text-[1.8rem] leading-tight md:text-[2.3rem]">
                Modeling at Drawing Club Prague
              </span>
              <span className="mt-2 block text-sm text-paper-bright/70">
                How to get in touch, current details and terms — on drawingclubprague.com.
              </span>
            </span>
            <ArrowUpRight size={28} className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
          </a>
        </div>
      </div>
    </>
  );
}

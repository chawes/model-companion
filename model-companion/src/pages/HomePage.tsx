import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../components/ui';
import { PoseGallery } from '../components/PoseGallery';
import { getPose } from '../data/poses';
import { SITE } from '../data/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Pose } from '../types';

const SESSION_STEPS = [
  { time: '1–2', unit: 'min', title: 'Gestures', text: 'Quick, bold actions to warm everyone up.' },
  { time: '3–5', unit: 'min', title: 'Short poses', text: 'Clear shapes, a little more stillness.' },
  { time: '10', unit: 'min', title: 'Medium', text: 'Settled poses with good support.' },
  { time: '15–20', unit: 'min', title: 'Long poses', text: 'Seated or reclining, fully comfortable.' },
];

const PRINCIPLES = [
  { n: 'I', title: 'Poses are suggestions', text: 'Everything here is inspiration. Adapt any pose to your body, or skip it entirely.' },
  { n: 'II', title: 'Your choices are yours', text: 'What you wear, how much, and which poses you take are always up to you.' },
  { n: 'III', title: 'Speak up any time', text: 'Ask for a break, change a pose or stop. Organizers and artists want you comfortable.' },
];

const FEATURED = ['contrapposto-rest', 'spiral-twist', 'reclining-propped', 'heroic-reach']
  .map((id) => getPose(id))
  .filter((p): p is Pose => Boolean(p));

export function HomePage() {
  useDocumentTitle();
  const hero = getPose('contrapposto-rest');

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-8 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-14 md:px-8 md:pb-24 md:pt-16">
        <div className="animate-enter">
          <p className="eyebrow">{SITE.clubName} · For life models</p>
          <h1 className="mt-5 font-display text-[3.6rem] leading-[0.92] tracking-[-0.02em] sm:text-[5rem] md:text-[6.4rem]">
            Model
            <br />
            <em className="text-sanguine">Companion</em>
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink-soft md:text-[1.15rem]">
            A small reference book for people who pose at our figure drawing sessions. Find pose ideas, learn what makes a pose
            work for artists, and arrive prepared and at ease.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/poses">
              Explore poses <ArrowRight size={18} aria-hidden />
            </ButtonLink>
            <ButtonLink to="/guide" variant="secondary">
              Model guide
            </ButtonLink>
          </div>
        </div>

        {hero && (
          <Link to={`/poses/${hero.id}`} className="group relative block animate-enter [animation-delay:120ms]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-paper-deep ring-1 ring-ink/5">
              <img
                src={hero.image}
                alt={hero.imageAlt}
                width={800}
                height={1000}
                fetchPriority="high"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.02]"
              />
            </div>
            <p className="mt-3 flex items-center justify-between">
              <span className="eyebrow">Plate 01 — {hero.title}</span>
              <ArrowUpRight size={16} className="text-ink-faint transition-colors group-hover:text-sanguine" aria-hidden />
            </p>
          </Link>
        )}
      </section>

      {/* Session flow */}
      <section className="border-y hairline bg-paper-bright/60 paper-grain">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <div className="grid gap-4 md:grid-cols-[1fr_2fr] md:gap-14">
            <div>
              <p className="eyebrow">The session</p>
              <h2 className="mt-3 font-display text-[2.2rem] leading-[1.05] md:text-[2.8rem]">
                From quick gestures to long, quiet poses.
              </h2>
              <p className="mt-4 text-ink-soft">
                Artists draw you from all sides while an organizer keeps time. Sessions usually build from short poses to longer
                ones, with a break in between. Every session differs a little — the organizer will walk you through it.
              </p>
              <Link to="/prep" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
                Session prep <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
            <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-[3px] bg-line md:grid-cols-4">
              {SESSION_STEPS.map((s, i) => (
                <li key={s.title} className="flex flex-col bg-paper p-5 md:min-h-56 md:p-6">
                  <span className="eyebrow">Step {i + 1}</span>
                  <span className="mt-4 whitespace-nowrap font-display text-[2.3rem] leading-none lg:text-[2.6rem]">
                    {s.time}
                    <span className="ml-1 font-sans text-sm text-ink-soft">{s.unit}</span>
                  </span>
                  <span className="mt-auto pt-6 text-[0.95rem] font-medium">{s.title}</span>
                  <span className="mt-1 text-[0.85rem] leading-snug text-ink-soft">{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <ul className="grid gap-10 md:grid-cols-3 md:gap-12">
          {PRINCIPLES.map((p) => (
            <li key={p.n} className="border-t border-ink pt-5">
              <span className="font-display text-xl italic text-sanguine">{p.n}.</span>
              <h3 className="mt-2 font-display text-[1.75rem] leading-tight">{p.title}</h3>
              <p className="mt-2 text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">From the library</p>
            <h2 className="mt-2 font-display text-[2.2rem] leading-none md:text-[2.8rem]">A few to start with</h2>
          </div>
          <Link to="/poses" className="hidden shrink-0 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline sm:inline-flex">
            All poses <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
        <PoseGallery poses={FEATURED} columns="compact" />
        <ButtonLink to="/poses" variant="secondary" className="mt-10 w-full sm:hidden">
          All poses <ArrowRight size={18} aria-hidden />
        </ButtonLink>
      </section>
    </>
  );
}

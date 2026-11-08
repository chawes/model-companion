import { ArrowUpRight } from 'lucide-react';
import { SITE } from '../data/site';

export function Footer() {
  return (
    <footer className="mt-24 border-t hairline">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto] md:px-8">
        <div className="max-w-md">
          <p className="font-display text-2xl leading-tight">
            Made for the models of <span className="italic">{SITE.clubName}</span>.
          </p>
          <p className="mt-3 text-sm text-ink-soft">
            Poses are suggestions, never instructions. Pose diagrams are original placeholder artwork.
          </p>
        </div>
        <ul className="flex flex-col gap-2 text-sm md:items-end">
          <li>
            <a href={SITE.modelingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-sanguine">
              Modeling at DCP <ArrowUpRight size={14} aria-hidden />
            </a>
          </li>
          <li>
            <a href={SITE.clubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-sanguine">
              drawingclubprague.com <ArrowUpRight size={14} aria-hidden />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

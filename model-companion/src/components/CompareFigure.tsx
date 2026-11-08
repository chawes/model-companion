import { useId, useState } from 'react';
import type { GuideView } from '../types';

/** Interactive A/B illustration — tap the toggle to compare two approaches. */
export function CompareFigure({ views }: { views: [GuideView, GuideView] }) {
  const [active, setActive] = useState<0 | 1>(1);
  const id = useId();
  const view = views[active];

  return (
    <figure className="rounded-[4px] bg-paper-bright p-3 ring-1 ring-ink/5 md:p-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-paper-deep">
        {views.map((v, i) => (
          <img
            key={v.image}
            src={v.image}
            alt={i === active ? v.alt : ''}
            aria-hidden={i !== active}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div role="tablist" aria-label="Compare examples" className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-paper-deep p-1">
        {views.map((v, i) => (
          <button
            key={v.label}
            role="tab"
            type="button"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            onClick={() => setActive(i as 0 | 1)}
            className={[
              'h-10 rounded-full text-[0.85rem] font-medium transition-all duration-300',
              i === active ? 'bg-ink text-paper-bright shadow-sm' : 'text-ink-soft hover:text-ink',
            ].join(' ')}
          >
            {v.label}
          </button>
        ))}
      </div>
      <figcaption id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="mt-3 px-1 text-[0.88rem] text-ink-soft" aria-live="polite">
        {view.caption}
      </figcaption>
    </figure>
  );
}

import { useId, useState } from 'react';
import { useLang } from '../i18n/LangContext';
import type { GuideView } from '../types';

/** Tap-to-compare illustration: two approaches side by side in one frame. */
export function CompareFigure({ views }: { views: [GuideView, GuideView] }) {
  const { l } = useLang();
  const [active, setActive] = useState<0 | 1>(1);
  const id = useId();

  return (
    <figure>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-paper-deep ring-1 ring-ink/5">
        {views.map((v, i) => (
          <img
            key={v.image}
            src={v.image}
            alt={i === active ? l(v.alt) : ''}
            aria-hidden={i !== active}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>
      <div role="tablist" className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-paper-deep p-1">
        {views.map((v, i) => (
          <button
            key={i}
            role="tab"
            type="button"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            onClick={() => setActive(i as 0 | 1)}
            className={`h-10 rounded-full text-[0.85rem] font-medium transition-all duration-300 ${
              i === active ? 'bg-ink text-paper-bright' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {l(v.label)}
          </button>
        ))}
      </div>
      <figcaption id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} aria-live="polite" className="mt-2 px-1 text-[0.85rem] text-ink-soft">
        {l(views[active].caption)}
      </figcaption>
    </figure>
  );
}

import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { CATEGORIES, DURATIONS } from '../data/taxonomy';
import type { PoseCategory, PoseDuration } from '../types';

interface Props {
  category: PoseCategory | null;
  duration: PoseDuration | null;
  onCategory: (c: PoseCategory | null) => void;
  onDuration: (d: PoseDuration | null) => void;
  onClear: () => void;
  resultCount: number;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        'h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-[0.85rem] transition-all duration-200',
        active
          ? 'border-ink bg-ink text-paper-bright'
          : 'border-line bg-paper-bright/60 text-ink-soft hover:border-ink/40 hover:text-ink',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-3">
      <span className="eyebrow hidden w-20 shrink-0 md:block">{label}</span>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-0.5 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {children}
      </div>
    </div>
  );
}

export function FilterBar({ category, duration, onCategory, onDuration, onClear, resultCount }: Props) {
  const active = Boolean(category || duration);
  return (
    <div className="space-y-3">
      <Row label="Category">
        <Chip active={!category} onClick={() => onCategory(null)}>
          All
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} active={category === c.id} onClick={() => onCategory(category === c.id ? null : c.id)}>
            {c.label}
          </Chip>
        ))}
      </Row>
      <Row label="Duration">
        <Chip active={!duration} onClick={() => onDuration(null)}>
          Any length
        </Chip>
        {DURATIONS.map((d) => (
          <Chip key={d.id} active={duration === d.id} onClick={() => onDuration(duration === d.id ? null : d.id)}>
            {d.short}
          </Chip>
        ))}
      </Row>
      <div className="flex items-center justify-between pt-1 md:pl-[5.75rem]">
        <p className="eyebrow" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'pose' : 'poses'}
        </p>
        {active && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[0.8rem] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            <X size={14} aria-hidden /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

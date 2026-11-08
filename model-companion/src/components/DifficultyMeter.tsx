import { DIFFICULTY } from '../data/taxonomy';
import type { Difficulty } from '../types';

export function DifficultyMeter({ value, showLabel = false }: { value: Difficulty; showLabel?: boolean }) {
  const { label } = DIFFICULTY[value];
  return (
    <span className="inline-flex items-center gap-2" title={`Hold difficulty: ${label}`}>
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`w-[4px] rounded-[1px] ${n <= value ? 'bg-ink' : 'bg-line'}`}
            style={{ height: 5 + n * 3 }}
          />
        ))}
      </span>
      <span className={showLabel ? '' : 'sr-only'}>{label}</span>
    </span>
  );
}

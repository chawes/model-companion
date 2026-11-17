import { useLang } from '../i18n/LangContext';
import type { Difficulty } from '../types';

/** ● ●● ●●● — how demanding the pose is to hold. */
export function DifficultyDots({ value, className = '' }: { value: Difficulty; className?: string }) {
  const { t } = useLang();
  const label = t(`diff${value}` as 'diff1' | 'diff2' | 'diff3');
  return (
    <span className={`inline-flex items-center gap-[3px] ${className}`} title={label} aria-label={`${t('difficulty')}: ${label}`} role="img">
      {Array.from({ length: value }, (_, i) => (
        <span key={i} className="size-[7px] rounded-full bg-current" />
      ))}
    </span>
  );
}

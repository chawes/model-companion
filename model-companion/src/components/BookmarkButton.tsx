import { Bookmark } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { useSavedPoses } from '../hooks/useSavedPoses';

interface Props {
  poseId: string;
  variant?: 'icon' | 'full';
  className?: string;
}

export function BookmarkButton({ poseId, variant = 'icon', className = '' }: Props) {
  const { t } = useLang();
  const { isSaved, toggleSaved } = useSavedPoses();
  const saved = isSaved(poseId);

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={() => toggleSaved(poseId)}
        aria-pressed={saved}
        className={[
          'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-medium transition-all duration-300',
          saved ? 'border border-ink text-ink hover:bg-paper-deep' : 'bg-ink text-paper-bright hover:bg-ink/85',
          className,
        ].join(' ')}
      >
        <Bookmark size={18} aria-hidden className={saved ? 'fill-sanguine text-sanguine' : ''} />
        {saved ? t('saved') : t('save')}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(poseId);
      }}
      aria-pressed={saved}
      aria-label={saved ? t('unsaveAria') : t('saveAria')}
      className={[
        'grid size-11 place-items-center rounded-full backdrop-blur-sm transition-all duration-300 active:scale-90',
        saved ? 'bg-ink text-paper-bright' : 'bg-paper-bright/85 text-ink hover:bg-paper-bright',
        className,
      ].join(' ')}
    >
      <Bookmark size={18} strokeWidth={1.8} aria-hidden className={saved ? 'fill-current' : ''} />
    </button>
  );
}

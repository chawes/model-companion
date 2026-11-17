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
          'inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-[0.95rem] font-semibold transition-colors duration-300',
          saved ? 'border border-fg text-fg hover:border-red-bright' : 'bg-red text-white hover:bg-red-bright',
          className,
        ].join(' ')}
      >
        <Bookmark size={18} aria-hidden className={saved ? 'fill-red-bright text-red-bright' : ''} />
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
        'grid size-9 place-items-center rounded-[4px] transition-colors duration-300 active:scale-95',
        saved ? 'bg-red-bright text-white' : 'bg-transparent text-black hover:bg-black/10',
        className,
      ].join(' ')}
    >
      <Bookmark size={18} strokeWidth={1.8} aria-hidden className={saved ? 'fill-current' : ''} />
    </button>
  );
}

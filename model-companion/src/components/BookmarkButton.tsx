import { Bookmark } from 'lucide-react';
import { useSavedPoses } from '../hooks/useSavedPoses';

interface Props {
  poseId: string;
  poseTitle: string;
  variant?: 'icon' | 'full';
  className?: string;
}

export function BookmarkButton({ poseId, poseTitle, variant = 'icon', className = '' }: Props) {
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
          saved
            ? 'border border-ink bg-transparent text-ink hover:bg-paper-deep'
            : 'bg-ink text-paper-bright hover:bg-ink/85',
          className,
        ].join(' ')}
      >
        <Bookmark size={18} aria-hidden className={`transition-transform duration-300 ${saved ? 'scale-110 fill-sanguine text-sanguine' : ''}`} />
        {saved ? 'Saved to My Poses' : 'Save to My Poses'}
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
      aria-label={saved ? `Remove ${poseTitle} from My Poses` : `Save ${poseTitle} to My Poses`}
      className={[
        'grid size-11 place-items-center rounded-full backdrop-blur-sm transition-all duration-300 active:scale-90',
        saved ? 'bg-ink text-paper-bright' : 'bg-paper-bright/80 text-ink hover:bg-paper-bright',
        className,
      ].join(' ')}
    >
      <Bookmark size={18} strokeWidth={1.8} aria-hidden className={saved ? 'fill-current' : ''} />
    </button>
  );
}

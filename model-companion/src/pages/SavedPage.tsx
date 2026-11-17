import { ArrowRight, Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PoseGallery } from '../components/PoseGallery';
import { useSavedPoses } from '../hooks/useSavedPoses';
import { useDocumentTitle, useLang } from '../i18n/LangContext';

export function SavedPage() {
  const { t } = useLang();
  useDocumentTitle(t('savedTitle'));
  const { savedPoses, clearSaved } = useSavedPoses();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  const onClear = () => {
    if (confirming) {
      clearSaved();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <header className="flex flex-col gap-4 pb-8 pt-8 md:flex-row md:items-end md:justify-between md:pb-10 md:pt-14">
        <div>
          <h1 className="font-display text-[2rem] leading-[1.05] md:text-[3.2rem]">{t('savedTitle')}</h1>
          <p className="mt-3 text-muted">{t('savedIntro')}</p>
        </div>
        {savedPoses.length > 0 && (
          <button type="button" onClick={onClear} className={`self-start text-sm underline-offset-4 hover:underline ${confirming ? 'text-red-bright' : 'text-muted'}`}>
            {confirming ? t('savedClearConfirm') : t('savedClear')}
          </button>
        )}
      </header>

      {savedPoses.length > 0 ? (
        <PoseGallery poses={savedPoses} />
      ) : (
        <div className="flex flex-col items-center rounded-md border border-dashed border-line px-6 py-16 text-center">
          <div className="grid size-16 place-items-center bg-surface-2">
            <Bookmark size={26} strokeWidth={1.4} className="text-muted" aria-hidden />
          </div>
          <h2 className="font-display mt-5 text-[1.3rem] leading-tight">{t('savedEmptyTitle')}</h2>
          <p className="mt-2 max-w-sm text-muted">{t('savedEmptyText')}</p>
          <Link to="/" className="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-red px-6 text-[0.95rem] font-medium text-white hover:bg-red-bright">
            {t('savedBrowse')} <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}

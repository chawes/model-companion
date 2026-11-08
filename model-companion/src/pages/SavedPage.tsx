import { ArrowRight, Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PoseGallery } from '../components/PoseGallery';
import { ButtonLink, PageIntro } from '../components/ui';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSavedPoses } from '../hooks/useSavedPoses';

export function SavedPage() {
  useDocumentTitle('My Poses');
  const { savedPoses, clearSaved } = useSavedPoses();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(t);
  }, [confirming]);

  return (
    <>
      <PageIntro
        eyebrow="My Poses"
        title={
          <>
            Your <em className="text-sanguine">collection</em>
          </>
        }
        aside={
          savedPoses.length > 0 ? (
            <button
              type="button"
              onClick={() => (confirming ? (clearSaved(), setConfirming(false)) : setConfirming(true))}
              className={`self-start text-sm underline-offset-4 hover:underline md:self-end ${confirming ? 'text-sanguine' : 'text-ink-soft'}`}
            >
              {confirming ? 'Tap again to remove all' : 'Clear collection'}
            </button>
          ) : null
        }
      >
        {savedPoses.length > 0
          ? `${savedPoses.length} saved ${savedPoses.length === 1 ? 'pose' : 'poses'}, kept on this device only — no account needed.`
          : 'Poses you bookmark appear here. They stay on this device — no account needed.'}
      </PageIntro>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {savedPoses.length > 0 ? (
          <PoseGallery poses={savedPoses} />
        ) : (
          <div className="flex flex-col items-center rounded-[4px] border border-dashed border-line px-6 py-16 text-center md:py-24">
            <div className="relative">
              <div className="grid size-20 place-items-center rounded-full bg-paper-deep">
                <Bookmark size={30} strokeWidth={1.3} className="text-ink-soft" aria-hidden />
              </div>
              <span className="absolute -right-1 -top-1 size-4 rounded-full bg-sanguine" aria-hidden />
            </div>
            <h2 className="mt-6 font-display text-[2rem] leading-tight">An empty sketchbook</h2>
            <p className="mt-2 max-w-sm text-ink-soft">
              Browse the library and tap the bookmark on any pose you'd like to try. Your picks will wait here for the next session.
            </p>
            <ButtonLink to="/poses" className="mt-7">
              Explore poses <ArrowRight size={18} aria-hidden />
            </ButtonLink>
          </div>
        )}
      </div>
    </>
  );
}

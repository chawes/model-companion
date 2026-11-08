import { FilterBar } from '../components/FilterBar';
import { PoseGallery } from '../components/PoseGallery';
import { PageIntro } from '../components/ui';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePoseFilters } from '../hooks/usePoseFilters';

export function PosesPage() {
  useDocumentTitle('Pose Library');
  const { filter, results, query, setCategory, setDuration, clear } = usePoseFilters();

  return (
    <>
      <PageIntro eyebrow="Pose Library" title="Poses to borrow">
        Reference ideas sorted by type and by how long they are comfortable to hold. Save the ones you like for your next
        session.
      </PageIntro>

      <div className="sticky top-14 z-20 border-y hairline bg-paper/92 backdrop-blur-md md:top-16">
        <div className="mx-auto max-w-6xl px-5 py-4 md:px-8">
          <FilterBar
            category={filter.category}
            duration={filter.duration}
            onCategory={setCategory}
            onDuration={setDuration}
            onClear={clear}
            resultCount={results.length}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-8 md:px-8 md:pt-12">
        {results.length > 0 ? (
          <PoseGallery poses={results} query={query} />
        ) : (
          <div className="py-20 text-center">
            <p className="font-display text-3xl">No poses match both filters.</p>
            <p className="mt-2 text-ink-soft">Try another duration, or clear the filters.</p>
            <button
              type="button"
              onClick={clear}
              className="mt-6 inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm hover:bg-ink hover:text-paper-bright"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}

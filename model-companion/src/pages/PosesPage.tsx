import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PoseGallery } from '../components/PoseGallery';
import { CATEGORIES, isCategory, POSES } from '../data/poses';
import { useDocumentTitle, useLang } from '../i18n/LangContext';
import type { PoseCategory } from '../types';

/** Category filter lives in the URL (?c=seated) so it survives opening a pose and going back. */
export function usePoseFilter() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('c');
  const category = isCategory(raw) ? raw : null;
  const results = useMemo(() => (category ? POSES.filter((p) => p.category === category) : POSES), [category]);
  const setCategory = (c: PoseCategory | null) => setParams(c ? { c } : {}, { replace: true });
  return { category, results, setCategory, query: category ? `?c=${category}` : '' };
}

export function PosesPage() {
  const { t } = useLang();
  useDocumentTitle();
  const { category, results, setCategory, query } = usePoseFilter();

  const chip = (active: boolean) =>
    `h-10 shrink-0 rounded-full border px-4 text-[0.88rem] transition-colors ${
      active ? 'border-ink bg-ink text-paper-bright' : 'border-line text-ink-soft hover:border-ink/40 hover:text-ink'
    }`;

  return (
    <>
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-8 md:px-8 md:pb-10 md:pt-14">
        <p className="eyebrow">{t('posesEyebrow')}</p>
        <h1 className="mt-3 font-display text-[2.8rem] leading-[0.98] tracking-tight md:text-[4.6rem]">{t('posesTitle')}</h1>
        <p className="mt-4 max-w-xl text-ink-soft md:text-[1.05rem]">{t('posesIntro')}</p>
      </header>

      <div className="sticky top-14 z-20 bg-paper/92 backdrop-blur-md md:top-16">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 md:px-8">
          <div role="group" aria-label="Filter" className="no-scrollbar -mx-5 flex flex-1 gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
            <button type="button" aria-pressed={!category} onClick={() => setCategory(null)} className={chip(!category)}>
              {t('filterAll')}
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" aria-pressed={category === c.id} onClick={() => setCategory(c.id)} className={chip(category === c.id)}>
                {t(c.key)}
              </button>
            ))}
          </div>
          <p className="eyebrow hidden shrink-0 sm:block" aria-live="polite">
            {results.length} {t('posesCount')}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-6 md:px-8 md:pt-8">
        <PoseGallery poses={results} query={query} />
      </div>
    </>
  );
}

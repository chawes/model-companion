import { useMemo, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DifficultyDots } from '../components/DifficultyDots';
import { PoseGallery } from '../components/PoseGallery';
import { SITE } from '../data/site';
import { CATEGORIES, DIFFICULTIES, DURATIONS, durationText, isCategory, isDuration, POSES, toDifficulty } from '../data/poses';
import { useDocumentTitle, useLang } from '../i18n/LangContext';

/**
 * Filters live in the URL (?c=seated&d=10&x=2) so they survive opening a pose and going back.
 */
export function usePoseFilter() {
  const [params, setParams] = useSearchParams();
  const category = isCategory(params.get('c')) ? (params.get('c') as (typeof CATEGORIES)[number]['id']) : null;
  const duration = isDuration(params.get('d')) ? (params.get('d') as (typeof DURATIONS)[number]) : null;
  const difficulty = toDifficulty(params.get('x'));

  const results = useMemo(
    () =>
      POSES.filter(
        (p) =>
          (!category || p.category === category) && (!duration || p.duration === duration) && (!difficulty || p.difficulty === difficulty),
      ),
    [category, duration, difficulty],
  );

  const set = (key: 'c' | 'd' | 'x', value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const query = params.toString() ? `?${params.toString()}` : '';
  return { category, duration, difficulty, results, set, query };
}

function Pill({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-[0.85rem] transition-colors ${
        active ? 'border-red-bright bg-red-bright text-white' : 'border-fg/35 text-fg hover:border-fg'
      }`}
    >
      {children}
    </button>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex min-w-0 items-center gap-3">
      <span className="hidden shrink-0 text-[0.85rem] font-semibold md:inline">{label}</span>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">{children}</div>
    </div>
  );
}

export function PosesPage() {
  const { t } = useLang();
  useDocumentTitle();
  const { category, duration, difficulty, results, set, query } = usePoseFilter();

  return (
    <>
      <header className="relative overflow-hidden border-b border-line">
        {SITE.heroImage && (
          <img
            src={SITE.heroImage}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-[62%] object-cover object-left opacity-90 [mask-image:linear-gradient(to_right,transparent,black_40%)] md:w-[58%]"
          />
        )}
        <div className="relative mx-auto max-w-6xl px-5 pb-8 pt-8 md:px-8 md:pb-12 md:pt-14">
          <p className="text-[0.8rem] font-medium uppercase tracking-wide text-red-bright md:text-[0.95rem]">{t('posesEyebrow')}</p>
          <h1 className="font-display mt-2 max-w-[13ch] text-[2rem] uppercase leading-[0.98] md:text-[3.6rem]">{t('posesTitle')}</h1>
          <p className="mt-4 max-w-md text-muted md:text-[1.1rem]">{t('posesIntro')}</p>
        </div>
      </header>

      <div className="border-b border-line bg-bg/95 backdrop-blur-md md:sticky md:top-[4.5rem] md:z-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-2.5 px-5 py-3 md:px-8 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-6 lg:gap-y-3">
          <Group label={t('filterCategory')}>
            <Pill active={!category} onClick={() => set('c', null)}>
              {t('filterAll')}
            </Pill>
            {CATEGORIES.map((c) => (
              <Pill key={c.id} active={category === c.id} onClick={() => set('c', c.id)}>
                {t(c.key)}
              </Pill>
            ))}
          </Group>
          <Group label={t('filterDuration')}>
            <Pill active={!duration} onClick={() => set('d', null)}>
              {t('filterAll')}
            </Pill>
            {DURATIONS.map((d) => (
              <Pill key={d} active={duration === d} onClick={() => set('d', d)}>
                {durationText(d)} {t('minutes')}
              </Pill>
            ))}
          </Group>
          <Group label={t('filterDifficulty')}>
            <Pill active={!difficulty} onClick={() => set('x', null)}>
              {t('filterAll')}
            </Pill>
            {DIFFICULTIES.map((d) => (
              <Pill key={d} active={difficulty === d} onClick={() => set('x', String(d))} label={t(`diff${d}` as 'diff1')}>
                <DifficultyDots value={d} />
              </Pill>
            ))}
          </Group>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-5 md:px-8 md:pt-7">
        <p className="mb-4 text-[0.95rem] text-muted" aria-live="polite">
          {results.length} {t('posesCount')}
        </p>
        {results.length > 0 ? (
          <PoseGallery poses={results} query={query} />
        ) : (
          <p className="rounded-md border border-dashed border-line px-6 py-16 text-center text-muted">{t('noResults')}</p>
        )}
      </div>
    </>
  );
}

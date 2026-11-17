import { ArrowUpRight } from 'lucide-react';
import { CompareFigure } from '../components/CompareFigure';
import { LESSONS, PREP } from '../data/guide';
import { SITE } from '../data/site';
import { useDocumentTitle, useLang } from '../i18n/LangContext';

export function GuidePage() {
  const { t, l } = useLang();
  useDocumentTitle(t('guideTitle'));

  return (
    <div className="mx-auto max-w-5xl px-5 md:px-8">
      <header className="pb-8 pt-8 md:pb-12 md:pt-14">
        <h1 className="font-display text-[2rem] leading-[1.05] md:text-[3.2rem]">{t('guideTitle')}</h1>
        <p className="mt-3 max-w-xl text-muted md:text-[1.05rem]">{t('guideIntro')}</p>
      </header>

      <section aria-labelledby="pose-section">
        <h2 id="pose-section" className="font-display border-b border-rule/60 pb-4 text-[1.25rem] md:text-[1.6rem]">
          {t('guidePoseSection')}
        </h2>
        {LESSONS.map((lesson, i) => (
          <article key={lesson.id} className="grid gap-6 border-b border-line py-10 md:grid-cols-[minmax(0,1fr)_17rem] md:gap-12 md:py-14">
            <div>
              <p className="font-display text-[0.95rem] text-red-bright">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="font-display mt-2 text-[1.4rem] leading-tight md:text-[1.75rem]">{l(lesson.title)}</h3>
              <p className="mt-3 leading-relaxed">{l(lesson.text)}</p>
              <p className="mt-5 border-l-2 border-red-bright pl-4 text-[0.95rem]">
                <span className="mr-2 font-semibold text-red-bright">{t('guideTakeaway')}:</span>
                {l(lesson.takeaway)}
              </p>
            </div>
            <div className="mx-auto w-full max-w-[17rem] md:mx-0">
              <CompareFigure views={lesson.views} />
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="prep-section" className="mt-16">
        <h2 id="prep-section" className="font-display border-b border-rule/60 pb-4 text-[1.25rem] md:text-[1.6rem]">
          {t('guidePrepSection')}
        </h2>
        <div className="grid gap-x-12 md:grid-cols-2">
          {PREP.map((block) => (
            <div key={block.id} className="border-b border-line py-8">
              <h3 className="font-display text-[1.15rem] leading-tight md:text-[1.3rem]">{l(block.title)}</h3>
              <ul className="mt-3 space-y-2">
                {block.items.map((item, k) => (
                  <li key={k} className="flex gap-3 text-[0.95rem] leading-relaxed">
                    <span className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-red-bright" aria-hidden />
                    <span>{l(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <a
          href={SITE.modelingUrl}
          target="_blank"
          rel="noreferrer"
          className="group mt-10 flex items-center justify-between gap-6 bg-red p-6 text-white transition-colors hover:bg-red-bright md:p-8"
        >
          <span>
            <span className="eyebrow text-white/60">{t('officialEyebrow')}</span>
            <span className="font-display mt-2 block text-[1.3rem] leading-tight md:text-[1.75rem]">{t('officialTitle')}</span>
            <span className="mt-2 block text-sm text-white/70">{t('officialText')}</span>
          </span>
          <ArrowUpRight size={28} className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
        </a>
      </section>
    </div>
  );
}

import { useState } from 'react';
import { Lightbox } from '../components/Lightbox';
import { useInspiration } from '../data/inspiration';
import { SITE } from '../data/site';
import { useDocumentTitle, useLang } from '../i18n/LangContext';

export function InspirationPage() {
  const { t } = useLang();
  useDocumentTitle(t('navInspiration'));
  const { items } = useInspiration();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-3 md:px-8">
      <header className="px-2 pb-6 pt-8 md:px-0 md:pb-10 md:pt-14">
        <h1 className="font-display text-[2rem] leading-[1.05] md:text-[3.2rem]">{t('inspirationTitle')}</h1>
        <p className="mt-3 max-w-xl text-muted md:text-[1.05rem]">{t('inspirationIntro')}</p>
      </header>

      {items === null ? (
        <div className="columns-2 gap-2 md:columns-3 md:gap-3 lg:columns-4" aria-hidden>
          {[5, 4, 6, 4, 5, 6, 4, 5].map((h, i) => (
            <div key={i} className="mb-2 animate-pulse bg-surface md:mb-3" style={{ aspectRatio: `4 / ${h}` }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mx-2 rounded-md border border-dashed border-line px-6 py-16 text-center text-muted md:mx-0">{t('inspirationEmpty')}</p>
      ) : (
        <ul className="columns-2 gap-2 md:columns-3 md:gap-3 lg:columns-4">
          {items.map((item, i) => (
            <li key={item.id} className="mb-2 break-inside-avoid md:mb-3">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="block w-full overflow-hidden rounded-md bg-surface-2 outline outline-1 -outline-offset-1 outline-transparent transition-[outline-color] hover:outline-red-bright"
                aria-label={`${t('openImage')} ${i + 1}`}
              >
                <img
                  src={item.file}
                  alt=""
                  width={item.w}
                  height={item.h}
                  loading={i < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-auto w-full transition-transform duration-700 hover:scale-[1.02]"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mx-2 mt-10 max-w-xl text-[0.78rem] leading-relaxed text-faint md:mx-0">
        {t('inspirationTakedown')}{' '}
        <a href={`mailto:${SITE.email}`} className="underline underline-offset-2 hover:text-fg">
          {SITE.email}
        </a>
      </p>

      {open !== null && items && <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

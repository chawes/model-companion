import { ArrowUpRight } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE } from '../data/site';
import { useLang } from '../i18n/LangContext';
import { BottomNavigation } from './BottomNavigation';
import { Header } from './Header';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { t } = useLang();

  // Scroll to top on page change (not when only the filter changes).
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only z-50 rounded bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t('skip')}
      </a>
      <Header />
      <main id="main" key={pathname} className="flex-1 animate-fade">
        {children}
      </main>
      <footer className="mt-20 border-t hairline pb-20 md:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-[0.82rem] text-ink-soft md:flex-row md:items-center md:justify-between md:px-8">
          <p className="max-w-md">{t('footer')}</p>
          <a href={SITE.clubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ink hover:text-sanguine">
            {SITE.clubName} <ArrowUpRight size={14} aria-hidden />
          </a>
        </div>
      </footer>
      <BottomNavigation />
    </div>
  );
}

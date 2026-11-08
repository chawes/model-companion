import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  // Scroll to top on page change (but not when only filters/query change).
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" key={pathname} className="flex-1 animate-fade">
        {children}
      </main>
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
      <BottomNavigation />
    </div>
  );
}

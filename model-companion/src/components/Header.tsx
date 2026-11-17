import { Link, useLocation } from 'react-router-dom';
import { SITE } from '../data/site';
import { useLang } from '../i18n/LangContext';
import { useSavedPoses } from '../hooks/useSavedPoses';
import { LangSwitch } from './LangSwitch';
import { isNavActive, NAV_ITEMS } from './nav';

export function Header() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const { savedIds } = useSavedPoses();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 md:h-[4.5rem] md:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3 md:gap-4" aria-label={`Model Companion — ${SITE.clubName}`}>
          {/* mobile: DCP symbol · desktop: horizontal DCP logo (original assets) */}
          <img src="/brand/dcp-symbol-white.png" alt="" width={148} height={240} className="h-8 w-auto md:hidden" />
          <img src="/brand/dcp-logo-white.png" alt={SITE.clubName} width={900} height={323} className="hidden h-10 w-auto md:block" />
          <span aria-hidden className="hidden h-8 w-px bg-line md:block" />
          <span className="font-display truncate text-[0.95rem] leading-none md:text-[1rem]">Model Companion</span>
        </Link>

        <div className="flex items-center gap-5">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => {
                const active = isNavActive(item.to, pathname);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      className={`inline-flex items-center gap-1.5 py-2 text-[0.95rem] transition-colors ${
                        active ? 'text-red-bright' : 'text-fg hover:text-red-bright'
                      }`}
                    >
                      {t(item.label)}
                      {item.to === '/saved' && savedIds.length > 0 && (
                        <span className="bg-red px-1.5 text-[0.7rem] leading-[1.15rem] text-white">{savedIds.length}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <LangSwitch />
        </div>
      </div>
    </header>
  );
}

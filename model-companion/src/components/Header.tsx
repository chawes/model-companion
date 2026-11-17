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
          <img src="/brand/dcp-logo-white.png" alt={SITE.clubName} width={900} height={323} className="h-8 w-auto md:h-11" />
          <span aria-hidden className="h-8 w-px bg-fg/30 md:h-10" />
          <span className="text-[0.68rem] font-medium uppercase leading-[1.15] tracking-wide md:text-[0.9rem]">
            Model
            <br />
            Companion
          </span>
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
                      className={`relative inline-flex items-center gap-1.5 py-2 text-[0.95rem] transition-colors ${
                        active ? 'font-semibold text-fg' : 'text-fg/85 hover:text-fg'
                      }`}
                    >
                      {t(item.label)}
                      {item.to === '/saved' && savedIds.length > 0 && (
                        <span className="bg-red px-1.5 text-[0.7rem] leading-[1.15rem] text-white">{savedIds.length}</span>
                      )}
                      <span aria-hidden className={`absolute inset-x-0 -bottom-[17px] h-[2px] bg-red-bright transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
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

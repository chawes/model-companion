import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { useSavedPoses } from '../hooks/useSavedPoses';
import { LangSwitch } from './LangSwitch';
import { isNavActive, NAV_ITEMS } from './nav';

export function Header() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const { savedIds } = useSavedPoses();

  return (
    <header className="sticky top-0 z-30 border-b hairline bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5 md:h-16 md:px-8">
        <Link to="/" className="flex items-baseline gap-3" aria-label="Model Companion">
          <span className="font-display text-[1.4rem] leading-none tracking-tight md:text-[1.6rem]">
            Model <em className="text-sanguine">Companion</em>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isNavActive(item.to, pathname);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      className={`relative inline-flex items-center gap-1.5 px-3 py-2 text-[0.92rem] transition-colors ${
                        active ? 'text-ink' : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      {t(item.label)}
                      {item.to === '/saved' && savedIds.length > 0 && (
                        <span className="font-mono text-[0.7rem] text-sanguine">{savedIds.length}</span>
                      )}
                      <span
                        aria-hidden
                        className={`absolute inset-x-3 -bottom-[13px] h-[2px] bg-sanguine transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}
                      />
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

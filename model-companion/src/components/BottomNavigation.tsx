import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { useSavedPoses } from '../hooks/useSavedPoses';
import { isNavActive, NAV_ITEMS } from './nav';

/** Mobile tab bar. */
export function BottomNavigation() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const { savedIds } = useSavedPoses();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = isNavActive(to, pathname);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={active ? 'page' : undefined}
                className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[0.7rem] font-medium transition-colors ${
                  active ? 'text-red-bright' : 'text-muted'
                }`}
              >
                <span className="relative">
                  <Icon size={21} strokeWidth={active ? 2.1 : 1.6} aria-hidden />
                  {to === '/saved' && savedIds.length > 0 && (
                    <span className="absolute -right-3 -top-1.5 min-w-4 bg-red px-1 text-center text-[0.6rem] leading-4 text-white">
                      {savedIds.length}
                    </span>
                  )}
                </span>
                {t(label)}
                <span aria-hidden className={`absolute top-0 h-[2px] w-10 bg-red-bright transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

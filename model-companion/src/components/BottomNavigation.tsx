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
      className="fixed inset-x-0 bottom-0 z-40 border-t hairline bg-paper/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = isNavActive(to, pathname);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={active ? 'page' : undefined}
                className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[0.72rem] font-medium transition-colors ${
                  active ? 'text-ink' : 'text-ink-faint'
                }`}
              >
                <span className="relative">
                  <Icon size={22} strokeWidth={active ? 2 : 1.6} aria-hidden />
                  {to === '/saved' && savedIds.length > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 min-w-4 rounded-full bg-sanguine px-1 text-center font-mono text-[0.6rem] leading-4 text-paper-bright">
                      {savedIds.length}
                    </span>
                  )}
                </span>
                {t(label)}
                <span aria-hidden className={`absolute top-0 h-[2px] w-8 bg-sanguine transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

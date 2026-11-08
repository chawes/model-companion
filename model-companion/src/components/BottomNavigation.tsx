import { NavLink } from 'react-router-dom';
import { useSavedPoses } from '../hooks/useSavedPoses';
import { NAV_ITEMS } from './nav';

/** Mobile tab bar — Home, Poses, Guide, Saved, Prep. */
export function BottomNavigation() {
  const { savedIds } = useSavedPoses();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t hairline bg-paper/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {NAV_ITEMS.map(({ to, short, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'relative flex h-16 flex-col items-center justify-center gap-1 text-[0.68rem] font-medium tracking-wide transition-colors',
                  isActive ? 'text-ink' : 'text-ink-faint active:text-ink',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon size={21} strokeWidth={isActive ? 2 : 1.6} aria-hidden />
                    {to === '/saved' && savedIds.length > 0 && (
                      <span className="absolute -right-2.5 -top-1.5 min-w-4 rounded-full bg-sanguine px-1 text-center font-mono text-[0.6rem] leading-4 text-paper-bright">
                        {savedIds.length}
                      </span>
                    )}
                  </span>
                  {short}
                  <span
                    aria-hidden
                    className={`absolute top-0 h-[2px] w-8 bg-sanguine transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

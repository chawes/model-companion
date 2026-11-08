import { Link, NavLink } from 'react-router-dom';
import { SITE } from '../data/site';
import { useSavedPoses } from '../hooks/useSavedPoses';
import { NAV_ITEMS } from './nav';

export function Header() {
  const { savedIds } = useSavedPoses();

  return (
    <header className="sticky top-0 z-30 border-b hairline bg-paper/90 backdrop-blur-md supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5 md:h-16 md:px-8">
        <Link to="/" className="group flex items-baseline gap-3" aria-label={`${SITE.appName} — home`}>
          <span className="font-display text-[1.45rem] leading-none tracking-tight md:text-[1.65rem]">
            Model <em className="text-sanguine">Companion</em>
          </span>
          <span className="eyebrow hidden sm:inline">{SITE.clubName}</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.slice(1).map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.9rem] transition-colors',
                      isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {item.to === '/saved' && savedIds.length > 0 && (
                        <span className="font-mono text-[0.7rem] text-sanguine">{savedIds.length}</span>
                      )}
                      <span
                        aria-hidden
                        className={`absolute inset-x-3.5 -bottom-[13px] h-[2px] bg-sanguine transition-opacity duration-300 ${
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
      </div>
    </header>
  );
}

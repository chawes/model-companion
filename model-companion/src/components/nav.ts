import { BookOpen, Bookmark, Images, LayoutGrid, type LucideIcon } from 'lucide-react';
import type { StringKey } from '../i18n/strings';

export interface NavItem {
  to: string;
  label: StringKey;
  icon: LucideIcon;
  end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'navPoses', icon: LayoutGrid },
  { to: '/inspiration', label: 'navInspiration', icon: Images },
  { to: '/saved', label: 'navSaved', icon: Bookmark },
  { to: '/guide', label: 'navGuide', icon: BookOpen },
];

/** "/" is active for the library and every pose detail page. */
export const isNavActive = (to: string, pathname: string) =>
  to === '/' ? pathname === '/' || pathname.startsWith('/poses') : pathname === to || pathname.startsWith(to + '/');

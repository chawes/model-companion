import { BookOpen, Bookmark, ClipboardList, House, LayoutGrid, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  short: string;
  icon: LucideIcon;
  end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', short: 'Home', icon: House, end: true },
  { to: '/poses', label: 'Pose Library', short: 'Poses', icon: LayoutGrid },
  { to: '/guide', label: 'Model Guide', short: 'Guide', icon: BookOpen },
  { to: '/saved', label: 'My Poses', short: 'Saved', icon: Bookmark },
  { to: '/prep', label: 'Session Prep', short: 'Prep', icon: ClipboardList },
];

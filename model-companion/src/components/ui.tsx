import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const base =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-medium transition-all duration-300 active:scale-[0.98]';

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  className = '',
}: {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  const styles =
    variant === 'primary'
      ? 'bg-ink text-paper-bright hover:bg-ink/85'
      : 'border border-ink/80 text-ink hover:bg-ink hover:text-paper-bright';
  return (
    <Link to={to} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-6xl px-5 pb-8 pt-8 md:px-8 md:pb-12 md:pt-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl animate-enter">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 font-display text-[2.75rem] leading-[1] tracking-tight md:text-[4.5rem]">{title}</h1>
          {children && <div className="mt-4 max-w-xl text-[1rem] text-ink-soft md:text-[1.05rem]">{children}</div>}
        </div>
        {aside}
      </div>
    </header>
  );
}

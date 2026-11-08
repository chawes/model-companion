import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { InspirationItem } from '../data/inspiration';
import { useLang } from '../i18n/LangContext';

interface Props {
  items: InspirationItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

/** Full-screen image viewer: tap arrows, swipe, or use ← → Esc. */
export function Lightbox({ items, index, onIndex, onClose }: Props) {
  const { t } = useLang();
  const item = items[index];
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const prev = () => onIndex((index - 1 + items.length) % items.length);
  const next = () => onIndex((index + 1) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // lock page scroll + focus the close button while open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!item) return null;

  const btn = 'grid size-12 place-items-center rounded-full bg-paper-bright/10 text-paper-bright transition-colors hover:bg-paper-bright/20';

  // portal to <body> so the overlay sits above the sticky header (main is its own stacking context)
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('navInspiration')}
      className="fixed inset-0 z-50 flex flex-col bg-ink animate-fade"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <span className="font-mono text-[0.75rem] tracking-wider text-paper-bright/60">
          {index + 1} / {items.length}
        </span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t('close')} className={btn}>
          <X size={22} aria-hidden />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 py-3 md:px-20" onClick={onClose}>
        <img
          key={item.id}
          src={item.file}
          alt=""
          className="max-h-full max-w-full animate-fade rounded-[2px] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {items.length > 1 && (
          <>
            <button type="button" onClick={(e) => (e.stopPropagation(), prev())} aria-label={t('previous')} className={`${btn} absolute left-4 top-1/2 hidden -translate-y-1/2 md:grid`}>
              <ChevronLeft size={24} aria-hidden />
            </button>
            <button type="button" onClick={(e) => (e.stopPropagation(), next())} aria-label={t('next')} className={`${btn} absolute right-4 top-1/2 hidden -translate-y-1/2 md:grid`}>
              <ChevronRight size={24} aria-hidden />
            </button>
          </>
        )}
      </div>

      <div className="min-h-12 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-[0.8rem] text-paper-bright/60">
        {item.source ? `${t('source')}: ${item.source}` : ''}
      </div>
    </div>,
    document.body,
  );
}

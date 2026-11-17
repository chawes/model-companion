import { useLang } from '../i18n/LangContext';
import type { Lang } from '../types';

const LANGS: { id: Lang; label: string }[] = [
  { id: 'cs', label: 'CZ' },
  { id: 'en', label: 'EN' },
];

export function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div role="group" aria-label="Jazyk / Language" className="flex border border-line">
      {LANGS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          lang={id}
          aria-pressed={lang === id}
          onClick={() => setLang(id)}
          className={`h-8 min-w-10 px-2.5 text-[0.75rem] font-medium tracking-wider transition-colors ${
            lang === id ? 'bg-fg text-bg' : 'text-muted hover:text-fg'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

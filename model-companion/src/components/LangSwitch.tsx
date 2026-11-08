import { useLang } from '../i18n/LangContext';
import type { Lang } from '../types';

const LANGS: Lang[] = ['cs', 'en'];

export function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div role="group" aria-label="Jazyk / Language" className="flex items-center rounded-full bg-paper-deep p-0.5">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={[
            'h-8 min-w-10 rounded-full px-2.5 font-mono text-[0.72rem] uppercase tracking-wider transition-colors',
            lang === l ? 'bg-ink text-paper-bright' : 'text-ink-soft hover:text-ink',
          ].join(' ')}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

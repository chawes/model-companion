import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang, Localized } from '../types';
import { STRINGS, type StringKey } from './strings';

const STORAGE_KEY = 'model-companion:lang';

function detectLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'cs' || fromUrl === 'en') return fromUrl;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'cs' || stored === 'en') return stored;
  } catch {
    // storage unavailable — fall through to browser language
  }
  return navigator.language.toLowerCase().startsWith('cs') || navigator.language.toLowerCase().startsWith('sk') ? 'cs' : 'en';
}

/** Czech typography: keep one-letter prepositions/conjunctions with the next word. */
const nbsp = (s: string) => s.replace(/(^|[\s(„])([kKsSvVzZoOuUaAiI])\s+/g, '$1$2 ');

interface LangValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** UI string by key */
  t: (key: StringKey) => string;
  /** pick the current language from a Localized object */
  l: (text: Localized) => string;
}

const LangContext = createContext<LangValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangValue>(() => {
    const fix = (s: string) => (lang === 'cs' ? nbsp(s) : s);
    return {
      lang,
      setLang,
      t: (key) => fix(STRINGS[lang][key]),
      l: (text) => fix(text[lang] || text.en),
    };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}

/** Sets the browser tab title. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — Model Companion` : 'Model Companion — Drawing Club Prague';
  }, [title]);
}

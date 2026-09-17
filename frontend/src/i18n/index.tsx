import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, LANGUAGES, LangCode } from './translations';

export { LANGUAGES };
export type { LangCode };

const STORAGE_KEY = 'agrolyft.lang';

interface I18nValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function readStoredLang(): LangCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in translations) return stored as LangCode;
  } catch {
    // localStorage can throw in private mode; fall through to default
  }
  return 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(readStoredLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: LangCode) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persisting the choice is best-effort only
    }
  };

  // Fall back to English so a missing translation shows real text, never a raw key.
  const t = (key: string) => translations[lang][key] ?? translations.en[key] ?? key;

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used inside I18nProvider');
  return ctx;
}

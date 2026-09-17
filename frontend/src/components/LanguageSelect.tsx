import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslation, LANGUAGES, LangCode } from '../i18n';

export function LanguageSelect() {
  const { lang, setLang, t } = useTranslation();

  return (
    <div className="flex items-center gap-1.5">
      <Languages className="h-4 w-4 text-green-700 flex-shrink-0" aria-hidden="true" />
      <label htmlFor="lang-select" className="sr-only">{t('nav.language')}</label>
      <select
        id="lang-select"
        value={lang}
        onChange={(e) => setLang(e.target.value as LangCode)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-800 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </div>
  );
}

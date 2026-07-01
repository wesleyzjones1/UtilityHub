import { createContext, useCallback, useContext, useState } from 'react';
import { getTranslation, getPageDescription, getPageTitle } from '../i18n/translations';

export const LANGUAGES = [
  { code: 'en', label: 'English',  short: 'EN' },
  { code: 'es', label: 'Español',  short: 'ES' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'de', label: 'Deutsch',  short: 'DE' },
  { code: 'zh', label: '中文',     short: 'ZH' },
  { code: 'ja', label: '日本語',   short: 'JA' },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('uh-lang') || 'en'
  );

  const changeLanguage = useCallback((code) => {
    setLanguage(code);
    localStorage.setItem('uh-lang', code);
  }, []);

  const t = useCallback((key) => getTranslation(language, key), [language]);

  /** Localized description for a registry page, falling back to its English text. */
  const td = useCallback((page) => getPageDescription(page.id, language, page.description), [language]);

  /** Localized title for a registry page, falling back to its English text. */
  const tt = useCallback((page) => getPageTitle(page.id, language, page.title), [language]);

  const currentLanguage = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, currentLanguage, changeLanguage, languages: LANGUAGES, t, td, tt }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

import { createContext, useCallback, useContext, useState } from 'react';
import { getTranslation } from '../i18n/translations';

export const LANGUAGES = [
  { code: 'en', label: 'English',  short: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'Español',  short: 'ES', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch',  short: 'DE', flag: '🇩🇪' },
  { code: 'zh', label: '中文',     short: 'ZH', flag: '🇨🇳' },
  { code: 'ja', label: '日本語',   short: 'JA', flag: '🇯🇵' },
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

  const currentLanguage = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, currentLanguage, changeLanguage, languages: LANGUAGES, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

import { describe, it, expect } from 'vitest';
import { translations, getTranslation } from './translations';
import { LANGUAGES } from '../context/LanguageContext';

const REQUIRED_KEYS = [
  'searchPlaceholder', 'searchLabel', 'searchNoResults', 'clearSearch',
  'switchToDark', 'switchToLight', 'navHome', 'openMenu', 'closeMenu',
  'selectLanguage', 'languageLabel', 'tools', 'tool',
];

describe('translations', () => {
  it('has an entry for every supported language', () => {
    for (const lang of LANGUAGES) {
      expect(translations[lang.code]).toBeDefined();
    }
  });

  it('every language has all required keys', () => {
    for (const lang of LANGUAGES) {
      for (const key of REQUIRED_KEYS) {
        expect(translations[lang.code][key], `${lang.code}.${key}`).toBeTruthy();
      }
    }
  });

  it('all values are non-empty strings', () => {
    for (const lang of LANGUAGES) {
      for (const [key, value] of Object.entries(translations[lang.code])) {
        expect(typeof value, `${lang.code}.${key} should be string`).toBe('string');
        expect(value.length, `${lang.code}.${key} should be non-empty`).toBeGreaterThan(0);
      }
    }
  });

  describe('getTranslation', () => {
    it('returns English value for key', () => {
      expect(getTranslation('en', 'navHome')).toBe('Home');
    });

    it('returns Spanish value for key', () => {
      expect(getTranslation('es', 'navHome')).toBe('Inicio');
    });

    it('falls back to English for unknown language', () => {
      expect(getTranslation('xx', 'navHome')).toBe('Home');
    });

    it('falls back to key string for unknown key', () => {
      expect(getTranslation('en', 'nonExistentKey')).toBe('nonExistentKey');
    });
  });
});

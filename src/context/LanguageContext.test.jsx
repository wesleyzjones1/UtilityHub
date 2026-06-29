import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage, LANGUAGES } from './LanguageContext';

let store = {};

beforeEach(() => {
  store = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(key => store[key] ?? null),
      setItem: vi.fn((key, val) => { store[key] = val; }),
    },
    writable: true,
    configurable: true,
  });
});

function Consumer() {
  const { language, currentLanguage, changeLanguage, languages, t } = useLanguage();
  return (
    <div>
      <span data-testid="code">{language}</span>
      <span data-testid="short">{currentLanguage.short}</span>
      <span data-testid="count">{languages.length}</span>
      <span data-testid="t-nav-home">{t('navHome')}</span>
      <button onClick={() => changeLanguage('es')}>switch-es</button>
    </div>
  );
}

describe('LanguageProvider', () => {
  it('defaults to English', () => {
    render(<LanguageProvider><Consumer /></LanguageProvider>);
    expect(screen.getByTestId('code').textContent).toBe('en');
    expect(screen.getByTestId('short').textContent).toBe('EN');
  });

  it('reads persisted language from localStorage', () => {
    store['uh-lang'] = 'fr';
    render(<LanguageProvider><Consumer /></LanguageProvider>);
    expect(screen.getByTestId('code').textContent).toBe('fr');
  });

  it('exposes all defined languages', () => {
    render(<LanguageProvider><Consumer /></LanguageProvider>);
    expect(Number(screen.getByTestId('count').textContent)).toBe(LANGUAGES.length);
  });

  it('changes language and persists', async () => {
    const user = userEvent.setup();
    render(<LanguageProvider><Consumer /></LanguageProvider>);
    await user.click(screen.getByRole('button'));
    expect(screen.getByTestId('code').textContent).toBe('es');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('uh-lang', 'es');
  });

  it('each language has a short code label', () => {
    for (const lang of LANGUAGES) {
      expect(lang.short).toBeTruthy();
    }
  });

  it('t() returns translation for current language', () => {
    render(<LanguageProvider><Consumer /></LanguageProvider>);
    expect(screen.getByTestId('t-nav-home').textContent).toBe('Home');
  });

  it('t() returns translated string after language change', async () => {
    const user = userEvent.setup();
    render(<LanguageProvider><Consumer /></LanguageProvider>);
    await user.click(screen.getByRole('button'));
    expect(screen.getByTestId('t-nav-home').textContent).toBe('Inicio');
  });

  it('throws if useLanguage is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow();
    spy.mockRestore();
  });
});

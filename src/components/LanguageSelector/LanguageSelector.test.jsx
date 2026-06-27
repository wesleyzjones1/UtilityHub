import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, LANGUAGES } from '../../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

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

function Wrapped() {
  return <LanguageProvider><LanguageSelector /></LanguageProvider>;
}

describe('LanguageSelector', () => {
  it('shows current language short code', () => {
    render(<Wrapped />);
    expect(screen.getByText('EN')).toBeDefined();
  });

  it('shows current language flag', () => {
    render(<Wrapped />);
    const enLang = LANGUAGES.find(l => l.code === 'en');
    expect(screen.getAllByText(enLang.flag).length).toBeGreaterThan(0);
  });

  it('dropdown is hidden initially', () => {
    render(<Wrapped />);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('opens dropdown on click', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    expect(screen.getByRole('listbox')).toBeDefined();
  });

  it('shows all language names when open', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    for (const lang of LANGUAGES) {
      expect(screen.getByText(lang.label)).toBeDefined();
    }
  });

  it('shows flags for all languages when open', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    for (const lang of LANGUAGES) {
      expect(screen.getAllByText(lang.flag).length).toBeGreaterThan(0);
    }
  });

  it('closes dropdown on Escape', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('changes language on option click', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    await user.click(screen.getByText('Español'));
    expect(screen.getByText('ES')).toBeDefined();
    expect(window.localStorage.setItem).toHaveBeenCalledWith('uh-lang', 'es');
  });

  it('closes dropdown after selecting a language', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /language/i }));
    await user.click(screen.getByText('Français'));
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

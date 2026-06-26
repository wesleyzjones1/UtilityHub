import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';

let store = {};

beforeEach(() => {
  store = {};
  const mock = {
    getItem: vi.fn(key => store[key] ?? null),
    setItem: vi.fn((key, val) => { store[key] = val; }),
  };
  Object.defineProperty(window, 'localStorage', { value: mock, writable: true, configurable: true });
  document.documentElement.removeAttribute('data-theme');
});

function Consumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('defaults to light theme', () => {
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('reads persisted dark theme from localStorage', () => {
    store['uh-theme'] = 'dark';
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('toggles from light to dark', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    await user.click(screen.getByRole('button'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('toggles from dark back to light', async () => {
    const user = userEvent.setup();
    store['uh-theme'] = 'dark';
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    await user.click(screen.getByRole('button'));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('persists theme to localStorage on toggle', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    await user.click(screen.getByRole('button'));
    expect(window.localStorage.setItem).toHaveBeenCalledWith('uh-theme', 'dark');
  });

  it('sets data-theme attribute on documentElement', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    await user.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('throws if useTheme is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow();
    spy.mockRestore();
  });
});

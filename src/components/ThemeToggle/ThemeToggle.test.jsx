import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

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
  return <ThemeProvider><ThemeToggle /></ThemeProvider>;
}

describe('ThemeToggle', () => {
  it('renders a button', () => {
    render(<Wrapped />);
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('has correct aria-label in dark mode (default)', () => {
    render(<Wrapped />);
    expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Switch to light mode');
  });

  it('has correct aria-label in light mode', () => {
    store['uh-theme'] = 'light';
    render(<Wrapped />);
    expect(screen.getByRole('button').getAttribute('aria-label')).toBe('Switch to dark mode');
  });

  it('toggles theme on click (dark → light)', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('aria-label')).toBe('Switch to light mode');
    await user.click(btn);
    expect(btn.getAttribute('aria-label')).toBe('Switch to dark mode');
  });

  it('persists toggled theme', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button'));
    expect(window.localStorage.setItem).toHaveBeenCalledWith('uh-theme', 'light');
  });
});

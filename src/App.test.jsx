import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { PAGES } from './registry/pages';

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
  document.documentElement.removeAttribute('data-theme');
  // App uses a hash router, so navigation is driven by location.hash.
  window.location.hash = '';
});

describe('App routing', () => {
  it('renders the home page at /', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
  });

  it('renders a header (banner) on the home page', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeDefined();
  });

  it('renders a footer (contentinfo)', () => {
    render(<App />);
    expect(screen.getByRole('contentinfo')).toBeDefined();
  });

  it('renders NotFound for an unknown route', () => {
    window.location.hash = '#/this-route-does-not-exist';
    render(<App />);
    expect(screen.getByText(/page not found/i)).toBeDefined();
  });

  it('renders a tool placeholder for a registry route', () => {
    const page = PAGES[0];
    window.location.hash = '#' + page.path;
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: page.title })).toBeDefined();
  });

  it('renders placeholder pages for a sample of routes', () => {
    const sample = [PAGES[0], PAGES[Math.floor(PAGES.length / 2)], PAGES[PAGES.length - 1]];
    for (const page of sample) {
      window.location.hash = '#' + page.path;
      const { unmount } = render(<App />);
      expect(screen.getByRole('heading', { level: 1, name: page.title })).toBeDefined();
      unmount();
    }
  });

  it('all registry routes have unique paths that resolve to a tool page', () => {
    const paths = PAGES.map(p => p.path);
    const unique = new Set(paths);
    expect(unique.size).toBe(paths.length);
    expect(paths.every(p => p.startsWith('/tools/'))).toBe(true);
  });
});

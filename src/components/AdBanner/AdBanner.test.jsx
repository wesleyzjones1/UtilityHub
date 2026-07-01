import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdPreferenceProvider } from '../../context/AdPreferenceContext';
import { LanguageProvider } from '../../context/LanguageContext';
import AdBanner from './AdBanner';

let store = {};

beforeEach(() => {
  store = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(key => store[key] ?? null),
      setItem: vi.fn((key, val) => { store[key] = val; }),
      removeItem: vi.fn(key => { delete store[key]; }),
    },
    writable: true,
    configurable: true,
  });
});

describe('AdBanner', () => {
  it('renders ad placeholder when ads are visible', () => {
    render(<LanguageProvider><AdPreferenceProvider><AdBanner /></AdPreferenceProvider></LanguageProvider>);
    expect(screen.getByText('Advertisement')).toBeDefined();
  });

  it('renders nothing when ads are hidden', () => {
    store['uh-hide-ads'] = 'true';
    render(<LanguageProvider><AdPreferenceProvider><AdBanner /></AdPreferenceProvider></LanguageProvider>);
    expect(screen.queryByText('Advertisement')).toBeNull();
  });

  it('has accessible role label', () => {
    render(<LanguageProvider><AdPreferenceProvider><AdBanner /></AdPreferenceProvider></LanguageProvider>);
    expect(screen.getByRole('complementary', { name: /advertisement/i })).toBeDefined();
  });
});

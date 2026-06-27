import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProProvider } from '../../context/ProContext';
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
  it('renders ad placeholder for non-pro users', () => {
    render(<ProProvider><AdBanner /></ProProvider>);
    expect(screen.getByText('Advertisement')).toBeDefined();
  });

  it('renders nothing for pro users', () => {
    store['uh-pro'] = 'true';
    render(<ProProvider><AdBanner /></ProProvider>);
    expect(screen.queryByText('Advertisement')).toBeNull();
  });

  it('has accessible role label', () => {
    render(<ProProvider><AdBanner /></ProProvider>);
    expect(screen.getByRole('complementary', { name: /advertisement/i })).toBeDefined();
  });
});

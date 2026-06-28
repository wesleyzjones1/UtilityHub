import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdPreferenceProvider, useAdPreference } from './AdPreferenceContext';

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

function Consumer() {
  const { adsHidden, hideAds, showAds, toggleAds } = useAdPreference();
  return (
    <div>
      <span data-testid="adsHidden">{String(adsHidden)}</span>
      <button onClick={hideAds}>hide</button>
      <button onClick={showAds}>show</button>
      <button onClick={toggleAds}>toggle</button>
    </div>
  );
}

describe('AdPreferenceProvider', () => {
  it('defaults to ads visible', () => {
    render(<AdPreferenceProvider><Consumer /></AdPreferenceProvider>);
    expect(screen.getByTestId('adsHidden').textContent).toBe('false');
  });

  it('reads persisted hide-ads state from localStorage', () => {
    store['uh-hide-ads'] = 'true';
    render(<AdPreferenceProvider><Consumer /></AdPreferenceProvider>);
    expect(screen.getByTestId('adsHidden').textContent).toBe('true');
  });

  it('honours the legacy uh-pro flag', () => {
    store['uh-pro'] = 'true';
    render(<AdPreferenceProvider><Consumer /></AdPreferenceProvider>);
    expect(screen.getByTestId('adsHidden').textContent).toBe('true');
  });

  it('hideAds sets and persists the preference', async () => {
    const user = userEvent.setup();
    render(<AdPreferenceProvider><Consumer /></AdPreferenceProvider>);
    await user.click(screen.getByRole('button', { name: 'hide' }));
    expect(screen.getByTestId('adsHidden').textContent).toBe('true');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('uh-hide-ads', 'true');
  });

  it('showAds clears the preference and the legacy key', async () => {
    const user = userEvent.setup();
    store['uh-hide-ads'] = 'true';
    render(<AdPreferenceProvider><Consumer /></AdPreferenceProvider>);
    await user.click(screen.getByRole('button', { name: 'show' }));
    expect(screen.getByTestId('adsHidden').textContent).toBe('false');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('uh-hide-ads');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('uh-pro');
  });

  it('toggleAds flips the state', async () => {
    const user = userEvent.setup();
    render(<AdPreferenceProvider><Consumer /></AdPreferenceProvider>);
    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('adsHidden').textContent).toBe('true');
    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('adsHidden').textContent).toBe('false');
  });

  it('throws if useAdPreference is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow();
    spy.mockRestore();
  });
});

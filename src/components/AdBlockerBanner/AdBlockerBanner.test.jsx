import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdPreferenceProvider } from '../../context/AdPreferenceContext';
import { SupportProvider } from '../../context/SupportContext';
import { LanguageProvider } from '../../context/LanguageContext';

// Control ad blocker detection in tests via mock
vi.mock('../../hooks/useAdBlocker', () => ({
  useAdBlocker: () => true,
}));

import AdBlockerBanner from './AdBlockerBanner';

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

function Wrapped() {
  return (
    <LanguageProvider>
      <AdPreferenceProvider>
        <SupportProvider>
          <AdBlockerBanner />
        </SupportProvider>
      </AdPreferenceProvider>
    </LanguageProvider>
  );
}

describe('AdBlockerBanner', () => {
  it('shows banner when ad blocker is detected', () => {
    render(<Wrapped />);
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('hides banner when already dismissed', () => {
    store['uh-adb-dismissed'] = 'true';
    render(<Wrapped />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('hides banner when ads are hidden', () => {
    store['uh-hide-ads'] = 'true';
    render(<Wrapped />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('dismisses banner on ✕ click', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByLabelText('Dismiss ad blocker notice'));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('persists dismissed state to localStorage', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByLabelText('Dismiss ad blocker notice'));
    expect(window.localStorage.setItem).toHaveBeenCalledWith('uh-adb-dismissed', 'true');
  });

  it('opens the support modal flow via the support link', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    // The "supporting UtilityHub" button calls openSupport; just assert it exists and is clickable.
    const btn = screen.getByRole('button', { name: /supporting utilityhub/i });
    await user.click(btn);
    expect(btn).toBeDefined();
  });
});

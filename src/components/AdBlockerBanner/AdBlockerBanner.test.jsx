import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProProvider } from '../../context/ProContext';

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

function Wrapped({ onOpenSupport = vi.fn() }) {
  return (
    <ProProvider>
      <AdBlockerBanner onOpenSupport={onOpenSupport} />
    </ProProvider>
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

  it('hides banner when user is pro', () => {
    store['uh-pro'] = 'true';
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

  it('calls onOpenSupport when "going ad-free" link is clicked', async () => {
    const user = userEvent.setup();
    const onOpenSupport = vi.fn();
    render(<Wrapped onOpenSupport={onOpenSupport} />);
    await user.click(screen.getByRole('button', { name: /going ad-free/i }));
    expect(onOpenSupport).toHaveBeenCalledOnce();
  });
});

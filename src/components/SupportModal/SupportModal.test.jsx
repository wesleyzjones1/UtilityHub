import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdPreferenceProvider } from '../../context/AdPreferenceContext';
import SupportModal from './SupportModal';

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

function Wrapped({ open = true, onClose = vi.fn() }) {
  return (
    <AdPreferenceProvider>
      <SupportModal open={open} onClose={onClose} />
    </AdPreferenceProvider>
  );
}

describe('SupportModal', () => {
  it('renders nothing when closed', () => {
    render(<Wrapped open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders dialog when open', () => {
    render(<Wrapped />);
    expect(screen.getByRole('dialog')).toBeDefined();
  });

  it('frames support honestly (no fake payment / subscription)', () => {
    render(<Wrapped />);
    expect(screen.getByText(/support utilityhub/i)).toBeDefined();
    expect(screen.queryByText(/i've paid/i)).toBeNull();
    expect(screen.queryByText(/\$5\/mo/i)).toBeNull();
  });

  it('offers share actions including a GitHub star link', () => {
    render(<Wrapped />);
    expect(screen.getByRole('link', { name: /star on github/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /copy link/i })).toBeDefined();
  });

  it('shows a free "Hide ads" option when ads are visible', () => {
    render(<Wrapped />);
    expect(screen.getByRole('button', { name: /hide ads/i })).toBeDefined();
  });

  it('hiding ads persists the honest preference', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /hide ads/i }));
    expect(window.localStorage.setItem).toHaveBeenCalledWith('uh-hide-ads', 'true');
  });

  it('closes when ✕ is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Wrapped onClose={onClose} />);
    await user.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Wrapped onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Wrapped onClose={onClose} />);
    await user.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

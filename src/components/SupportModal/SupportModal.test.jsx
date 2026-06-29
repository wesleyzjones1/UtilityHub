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

  it('offers a GitHub star link when no donation links are configured', () => {
    render(<Wrapped />);
    expect(screen.getByRole('link', { name: /star on github/i })).toBeDefined();
  });

  it('does not show privacy/tracking reassurance copy', () => {
    render(<Wrapped />);
    expect(screen.queryByText(/no tracking/i)).toBeNull();
    expect(screen.queryByText(/nothing is uploaded/i)).toBeNull();
    expect(screen.queryByText(/no account/i)).toBeNull();
  });

  it('offers a subtle "Already paid? Remove ads" option when ads are visible', () => {
    render(<Wrapped />);
    expect(screen.getByRole('button', { name: /already paid\? remove ads/i })).toBeDefined();
  });

  it('removing ads persists the preference', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /already paid\? remove ads/i }));
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

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProProvider } from '../../context/ProContext';
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
    <ProProvider>
      <SupportModal open={open} onClose={onClose} />
    </ProProvider>
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

  it('shows the price and benefits', () => {
    render(<Wrapped />);
    expect(screen.getByText(/go ad-free for \$5\/mo/i)).toBeDefined();
    expect(screen.getByText(/no ads anywhere/i)).toBeDefined();
  });

  it('shows "Continue to payment" button initially', () => {
    render(<Wrapped />);
    expect(screen.getByRole('button', { name: /continue to payment/i })).toBeDefined();
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

  it('shows post-payment state after clicking Continue', async () => {
    const user = userEvent.setup();
    // Mock window.open
    const openMock = vi.fn();
    vi.stubGlobal('open', openMock);
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /continue to payment/i }));
    expect(screen.getByRole('button', { name: /i've paid/i })).toBeDefined();
    vi.unstubAllGlobals();
  });

  it('activates pro when "I\'ve paid" is clicked', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('open', vi.fn());
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /continue to payment/i }));
    await user.click(screen.getByRole('button', { name: /i've paid/i }));
    expect(window.localStorage.setItem).toHaveBeenCalledWith('uh-pro', 'true');
    vi.unstubAllGlobals();
  });

  it('shows pro confirmation when isPro is already true', () => {
    store['uh-pro'] = 'true';
    render(<Wrapped />);
    expect(screen.getByText(/you're ad-free/i)).toBeDefined();
  });
});

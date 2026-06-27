import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProProvider, usePro } from './ProContext';

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
  const { isPro, activatePro, deactivatePro } = usePro();
  return (
    <div>
      <span data-testid="isPro">{String(isPro)}</span>
      <button onClick={activatePro}>activate</button>
      <button onClick={deactivatePro}>deactivate</button>
    </div>
  );
}

describe('ProProvider', () => {
  it('defaults to non-pro', () => {
    render(<ProProvider><Consumer /></ProProvider>);
    expect(screen.getByTestId('isPro').textContent).toBe('false');
  });

  it('reads persisted pro state from localStorage', () => {
    store['uh-pro'] = 'true';
    render(<ProProvider><Consumer /></ProProvider>);
    expect(screen.getByTestId('isPro').textContent).toBe('true');
  });

  it('activatePro sets isPro to true', async () => {
    const user = userEvent.setup();
    render(<ProProvider><Consumer /></ProProvider>);
    await user.click(screen.getByRole('button', { name: 'activate' }));
    expect(screen.getByTestId('isPro').textContent).toBe('true');
  });

  it('activatePro persists to localStorage', async () => {
    const user = userEvent.setup();
    render(<ProProvider><Consumer /></ProProvider>);
    await user.click(screen.getByRole('button', { name: 'activate' }));
    expect(window.localStorage.setItem).toHaveBeenCalledWith('uh-pro', 'true');
  });

  it('deactivatePro sets isPro to false', async () => {
    const user = userEvent.setup();
    store['uh-pro'] = 'true';
    render(<ProProvider><Consumer /></ProProvider>);
    await user.click(screen.getByRole('button', { name: 'deactivate' }));
    expect(screen.getByTestId('isPro').textContent).toBe('false');
  });

  it('deactivatePro removes key from localStorage', async () => {
    const user = userEvent.setup();
    store['uh-pro'] = 'true';
    render(<ProProvider><Consumer /></ProProvider>);
    await user.click(screen.getByRole('button', { name: 'deactivate' }));
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('uh-pro');
  });

  it('throws if usePro is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow();
    spy.mockRestore();
  });
});

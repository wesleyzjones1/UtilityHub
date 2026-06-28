import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SupportProvider, useSupport } from './SupportContext';

function Consumer() {
  const { open, openSupport, closeSupport } = useSupport();
  return (
    <div>
      <span data-testid="open">{String(open)}</span>
      <button onClick={openSupport}>open</button>
      <button onClick={closeSupport}>close</button>
    </div>
  );
}

describe('SupportProvider', () => {
  it('defaults to closed', () => {
    render(<SupportProvider><Consumer /></SupportProvider>);
    expect(screen.getByTestId('open').textContent).toBe('false');
  });

  it('openSupport opens and closeSupport closes', async () => {
    const user = userEvent.setup();
    render(<SupportProvider><Consumer /></SupportProvider>);
    await user.click(screen.getByRole('button', { name: 'open' }));
    expect(screen.getByTestId('open').textContent).toBe('true');
    await user.click(screen.getByRole('button', { name: 'close' }));
    expect(screen.getByTestId('open').textContent).toBe('false');
  });

  it('throws if useSupport is used outside provider', () => {
    expect(() => render(<Consumer />)).toThrow();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useUrlState } from './useUrlState';

function Consumer() {
  const [mode, setMode] = useUrlState('mode', 'encode');
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button onClick={() => setMode('decode')}>decode</button>
      <button onClick={() => setMode('')}>clear</button>
    </div>
  );
}

function renderAt(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Consumer />
    </MemoryRouter>
  );
}

describe('useUrlState', () => {
  it('falls back to the default when the param is absent', () => {
    renderAt('/');
    expect(screen.getByTestId('mode').textContent).toBe('encode');
  });

  it('reads the initial value from the query string', () => {
    renderAt('/?mode=decode');
    expect(screen.getByTestId('mode').textContent).toBe('decode');
  });

  it('updates the value when set', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('button', { name: 'decode' }));
    expect(screen.getByTestId('mode').textContent).toBe('decode');
  });

  it('clearing the value restores the default', async () => {
    const user = userEvent.setup();
    renderAt('/?mode=decode');
    await user.click(screen.getByRole('button', { name: 'clear' }));
    expect(screen.getByTestId('mode').textContent).toBe('encode');
  });
});

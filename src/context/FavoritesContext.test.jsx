import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoritesProvider, useFavorites } from './FavoritesContext';

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

function Consumer({ id = 'word-counter' }) {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  return (
    <div>
      <span data-testid="count">{favorites.length}</span>
      <span data-testid="isFav">{String(isFavorite(id))}</span>
      <button onClick={() => toggleFavorite(id)}>toggle</button>
    </div>
  );
}

describe('FavoritesProvider', () => {
  it('defaults to no favorites', () => {
    render(<FavoritesProvider><Consumer /></FavoritesProvider>);
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('reads persisted favorites from localStorage', () => {
    store['uh-favorites'] = JSON.stringify(['word-counter']);
    render(<FavoritesProvider><Consumer /></FavoritesProvider>);
    expect(screen.getByTestId('isFav').textContent).toBe('true');
  });

  it('toggles a favorite on and persists it', async () => {
    const user = userEvent.setup();
    render(<FavoritesProvider><Consumer /></FavoritesProvider>);
    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('isFav').textContent).toBe('true');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('uh-favorites', JSON.stringify(['word-counter']));
  });

  it('toggles a favorite back off', async () => {
    const user = userEvent.setup();
    store['uh-favorites'] = JSON.stringify(['word-counter']);
    render(<FavoritesProvider><Consumer /></FavoritesProvider>);
    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('isFav').textContent).toBe('false');
  });

  it('tolerates malformed localStorage data', () => {
    store['uh-favorites'] = 'not json';
    render(<FavoritesProvider><Consumer /></FavoritesProvider>);
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('throws if useFavorites is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow();
    spy.mockRestore();
  });
});

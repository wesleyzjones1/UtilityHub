import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoritesProvider } from '../../context/FavoritesContext';
import { LanguageProvider } from '../../context/LanguageContext';
import FavoriteButton from './FavoriteButton';

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

function Wrapped(props) {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <FavoriteButton pageId="word-counter" title="Word Counter" {...props} />
      </FavoritesProvider>
    </LanguageProvider>
  );
}

describe('FavoriteButton', () => {
  it('starts unpressed with an "add" label', () => {
    render(<Wrapped />);
    const btn = screen.getByRole('button', { name: /add word counter to favorites/i });
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  it('toggles to pressed and updates the label', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.click(screen.getByRole('button', { name: /add word counter to favorites/i }));
    expect(screen.getByRole('button', { name: /remove word counter from favorites/i }).getAttribute('aria-pressed')).toBe('true');
  });

  it('renders a text label when showLabel is set', () => {
    render(<Wrapped showLabel />);
    expect(screen.getByText('Save to favorites')).toBeDefined();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CommandPalette from './CommandPalette';
import { LanguageProvider } from '../../context/LanguageContext';

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
    <MemoryRouter>
      <LanguageProvider>
        <CommandPalette open={open} onClose={onClose} />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    render(<Wrapped open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders a search input when open', () => {
    render(<Wrapped />);
    expect(screen.getByLabelText('Search tools')).toBeDefined();
  });

  it('shows matching results as the user types', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.type(screen.getByLabelText('Search tools'), 'json');
    expect(screen.getAllByText(/json/i).length).toBeGreaterThan(0);
  });

  it('shows an empty message for no matches', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.type(screen.getByLabelText('Search tools'), 'zzzznomatch');
    expect(screen.getByText(/no tools found/i)).toBeDefined();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Wrapped onClose={onClose} />);
    await user.type(screen.getByLabelText('Search tools'), '{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('navigating with Enter closes the palette', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Wrapped onClose={onClose} />);
    await user.type(screen.getByLabelText('Search tools'), 'word counter');
    await user.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalled();
  });

  it('suggests recent tools when the query is empty', () => {
    store['uh-recent-tools'] = JSON.stringify(['word-counter']);
    render(<Wrapped />);
    expect(screen.getByText('Recent')).toBeDefined();
    expect(screen.getByText('Word Counter')).toBeDefined();
  });
});

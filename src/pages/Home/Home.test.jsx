import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';
import Home from './Home';
import { CATEGORIES, PAGES } from '../../registry/pages';

let store = {};

beforeEach(() => {
  store = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(key => store[key] ?? null),
      setItem: vi.fn((key, val) => { store[key] = val; }),
    },
    writable: true,
    configurable: true,
  });
});

function Wrapped() {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Home page', () => {
  it('renders a heading', () => {
    render(<Wrapped />);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
  });

  it('shows total tool count in the hero', () => {
    render(<Wrapped />);
    expect(screen.getByText(new RegExp(`${PAGES.length} tools`, 'i'))).toBeDefined();
  });

  it('renders a category section for each category', () => {
    render(<Wrapped />);
    for (const cat of Object.values(CATEGORIES)) {
      expect(screen.getByText(cat.label)).toBeDefined();
    }
  });

  it('renders a search input in the hero', () => {
    render(<Wrapped />);
    expect(screen.getByLabelText('Search all tools')).toBeDefined();
  });

  it('search shows results matching query', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.type(screen.getByLabelText('Search all tools'), 'json');
    expect(screen.getAllByText('JSON Formatter / Minifier')[0]).toBeDefined();
  });

  it('search shows empty state for no match', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.type(screen.getByLabelText('Search all tools'), 'xyzzy_no_match');
    expect(screen.getByText(/no tools found/i)).toBeDefined();
  });

  it('clear button resets the search', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    const input = screen.getByLabelText('Search all tools');
    await user.type(input, 'json');
    await user.click(screen.getByLabelText('Clear search'));
    expect(input.value).toBe('');
  });

  it('renders navigation links to tool pages', () => {
    render(<Wrapped />);
    const links = screen.getAllByRole('link');
    expect(links.some(l => l.getAttribute('href')?.startsWith('/tools/'))).toBe(true);
  });

  it('ArrowDown moves active result to the first item', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    const input = screen.getByLabelText('Search all tools');
    await user.type(input, 'json');
    await user.keyboard('{ArrowDown}');
    const options = screen.getAllByRole('option');
    expect(options[0].getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowDown then ArrowUp returns to no active item', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    const input = screen.getByLabelText('Search all tools');
    await user.type(input, 'json');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowUp}');
    const options = screen.getAllByRole('option');
    expect(options.every(o => o.getAttribute('aria-selected') === 'false')).toBe(true);
  });

  it('Escape clears the search query', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    const input = screen.getByLabelText('Search all tools');
    await user.type(input, 'json');
    await user.keyboard('{Escape}');
    expect(input.value).toBe('');
  });

  it('"View all" link points to category page for categories with more than 4 tools', () => {
    render(<Wrapped />);
    const viewAllLinks = screen.getAllByRole('link', { name: /view all \d+ tools/i });
    expect(viewAllLinks.length).toBeGreaterThan(0);
    for (const link of viewAllLinks) {
      expect(link.getAttribute('href')).toMatch(/^\/tools\/category\//);
    }
  });
});

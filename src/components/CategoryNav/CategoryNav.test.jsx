import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CategoryNav from './CategoryNav';
import { CATEGORIES, PAGE_BY_CATEGORY } from '../../registry/pages';

function Wrapped() {
  return <MemoryRouter><CategoryNav /></MemoryRouter>;
}

const firstCatId = Object.keys(CATEGORIES)[0];
const firstCat = CATEGORIES[firstCatId];

describe('CategoryNav', () => {
  it('renders a button for each category', () => {
    render(<Wrapped />);
    for (const cat of Object.values(CATEGORIES)) {
      expect(screen.getByRole('button', { name: new RegExp(cat.label, 'i') })).toBeDefined();
    }
  });

  it('no dropdowns visible initially', () => {
    render(<Wrapped />);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('shows dropdown on mouse enter', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.hover(screen.getByRole('button', { name: new RegExp(firstCat.label, 'i') }));
    expect(screen.getByRole('menu')).toBeDefined();
  });

  it('hides dropdown on mouse leave', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    const btn = screen.getByRole('button', { name: new RegExp(firstCat.label, 'i') });
    await user.hover(btn);
    await user.unhover(btn);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes dropdown on Escape', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.hover(screen.getByRole('button', { name: new RegExp(firstCat.label, 'i') }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('dropdown contains tool links for the hovered category', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.hover(screen.getByRole('button', { name: new RegExp(firstCat.label, 'i') }));
    const pages = PAGE_BY_CATEGORY[firstCatId];
    for (const page of pages) {
      expect(screen.getByRole('menuitem', { name: page.title })).toBeDefined();
    }
  });

  it('sets aria-expanded=true on the open button', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    const btn = screen.getByRole('button', { name: new RegExp(firstCat.label, 'i') });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    await user.hover(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('only one dropdown open at a time', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    const catEntries = Object.values(CATEGORIES);
    const btn1 = screen.getByRole('button', { name: new RegExp(catEntries[0].label, 'i') });
    const btn2 = screen.getByRole('button', { name: new RegExp(catEntries[1].label, 'i') });
    await user.hover(btn1);
    await user.hover(btn2);
    expect(screen.getAllByRole('menu').length).toBe(1);
  });
});

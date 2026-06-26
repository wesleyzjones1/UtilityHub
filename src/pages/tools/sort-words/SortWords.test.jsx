import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import SortWords from './SortWords';

const PAGE = {
  id: 'sort-words', title: 'Sort Words',
  description: 'Sort words.', category: 'text',
  path: '/tools/sort-words',
};

describe('SortWords', () => {
  it('renders title', () => {
    renderWithRouter(<SortWords page={PAGE} />);
    expect(screen.getAllByText('Sort Words').length).toBeGreaterThan(0);
  });

  it('sorts words alphabetically A→Z by default', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SortWords page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /words/i }), 'banana apple cherry');
    const output = screen.getByRole('textbox', { name: /sorted/i }).value;
    expect(output.split('\n')).toEqual(['apple', 'banana', 'cherry']);
  });

  it('sorts Z→A when desc selected', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SortWords page={PAGE} />);
    await user.selectOptions(screen.getByRole('combobox'), 'desc');
    await user.type(screen.getByRole('textbox', { name: /words/i }), 'apple banana');
    const output = screen.getByRole('textbox', { name: /sorted/i }).value;
    expect(output.split('\n')[0].toLowerCase()).toBe('banana');
  });

  it('renders sort order select', () => {
    renderWithRouter(<SortWords page={PAGE} />);
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  it('renders case sensitive toggle', () => {
    renderWithRouter(<SortWords page={PAGE} />);
    expect(screen.getByRole('switch')).toBeDefined();
  });
});

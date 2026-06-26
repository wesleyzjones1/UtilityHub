import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import AddPunctuation from './AddPunctuation';

const PAGE = {
  id: 'add-punctuation', title: 'Add Punctuation',
  description: 'Add punctuation.', category: 'text',
  path: '/tools/add-punctuation',
};

describe('AddPunctuation', () => {
  it('renders the page title', () => {
    renderWithRouter(<AddPunctuation page={PAGE} />);
    expect(screen.getAllByText('Add Punctuation').length).toBeGreaterThan(0);
  });

  it('adds a period to lines missing punctuation', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AddPunctuation page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'Hello');
    expect(screen.getByRole('textbox', { name: /with punctuation/i }).value).toBe('Hello.');
  });

  it('does not add period to line that already has it', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AddPunctuation page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'Hello.');
    expect(screen.getByRole('textbox', { name: /with punctuation/i }).value).toBe('Hello.');
  });

  it('selects different punctuation marks', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AddPunctuation page={PAGE} />);
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], '!');
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'Hello');
    expect(screen.getByRole('textbox', { name: /with punctuation/i }).value).toBe('Hello!');
  });

  it('renders both control dropdowns', () => {
    renderWithRouter(<AddPunctuation page={PAGE} />);
    expect(screen.getAllByRole('combobox').length).toBe(2);
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import RemoveAllWhitespace from './RemoveAllWhitespace';

const PAGE = {
  id: 'remove-all-whitespace', title: 'Remove All Whitespace',
  description: 'Remove whitespace.', category: 'text',
  path: '/tools/remove-all-whitespace',
};

describe('RemoveAllWhitespace', () => {
  it('renders title', () => {
    renderWithRouter(<RemoveAllWhitespace page={PAGE} />);
    expect(screen.getAllByText('Remove All Whitespace').length).toBeGreaterThan(0);
  });

  it('removes all whitespace by default', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RemoveAllWhitespace page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'a b c');
    expect(screen.getByRole('textbox', { name: /cleaned/i }).value).toBe('abc');
  });

  it('collapses extra spaces when mode is extra', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RemoveAllWhitespace page={PAGE} />);
    await user.selectOptions(screen.getByRole('combobox'), 'extra');
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'a  b  c');
    expect(screen.getByRole('textbox', { name: /cleaned/i }).value).toBe('a b c');
  });
});

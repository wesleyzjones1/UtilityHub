import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import RemoveTrailingWhitespace from './RemoveTrailingWhitespace';

const PAGE = {
  id: 'remove-trailing-whitespace', title: 'Remove Trailing Whitespace',
  description: 'Remove trailing whitespace.', category: 'text',
  path: '/tools/remove-trailing-whitespace',
};

describe('RemoveTrailingWhitespace', () => {
  it('renders title', () => {
    renderWithRouter(<RemoveTrailingWhitespace page={PAGE} />);
    expect(screen.getAllByText('Remove Trailing Whitespace').length).toBeGreaterThan(0);
  });

  it('removes trailing spaces from each line', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RemoveTrailingWhitespace page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'hello   ');
    expect(screen.getByRole('textbox', { name: /cleaned/i }).value).toBe('hello');
  });
});

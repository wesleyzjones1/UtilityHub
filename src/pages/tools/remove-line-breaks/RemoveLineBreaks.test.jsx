import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import RemoveLineBreaks from './RemoveLineBreaks';

const PAGE = {
  id: 'remove-line-breaks', title: 'Remove Line Breaks',
  description: 'Remove line breaks.', category: 'text',
  path: '/tools/remove-line-breaks',
};

describe('RemoveLineBreaks', () => {
  it('renders title', () => {
    renderWithRouter(<RemoveLineBreaks page={PAGE} />);
    expect(screen.getAllByText('Remove Line Breaks').length).toBeGreaterThan(0);
  });

  it('removes line breaks and joins with space', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RemoveLineBreaks page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /multi-line/i }), 'hello\nworld');
    expect(screen.getByRole('textbox', { name: /single line/i }).value).toBe('hello world');
  });

  it('renders replacement dropdown', () => {
    renderWithRouter(<RemoveLineBreaks page={PAGE} />);
    expect(screen.getByRole('combobox')).toBeDefined();
  });
});

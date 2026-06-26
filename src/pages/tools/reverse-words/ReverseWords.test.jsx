import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ReverseWords from './ReverseWords';

const PAGE = {
  id: 'reverse-words', title: 'Reverse Words',
  description: 'Reverse word order.', category: 'text',
  path: '/tools/reverse-words',
};

describe('ReverseWords', () => {
  it('renders title', () => {
    renderWithRouter(<ReverseWords page={PAGE} />);
    expect(screen.getAllByText('Reverse Words').length).toBeGreaterThan(0);
  });

  it('reverses word order', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ReverseWords page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /original/i }), 'one two three');
    expect(screen.getByRole('textbox', { name: /reversed words/i }).value).toBe('three two one');
  });
});

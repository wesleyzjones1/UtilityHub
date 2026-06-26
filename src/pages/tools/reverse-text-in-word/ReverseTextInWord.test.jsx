import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ReverseTextInWord from './ReverseTextInWord';

const PAGE = {
  id: 'reverse-text-in-word', title: 'Reverse Text in Each Word',
  description: 'Reverse chars in each word.', category: 'text',
  path: '/tools/reverse-text-in-word',
};

describe('ReverseTextInWord', () => {
  it('renders title', () => {
    renderWithRouter(<ReverseTextInWord page={PAGE} />);
    expect(screen.getAllByText('Reverse Text in Each Word').length).toBeGreaterThan(0);
  });

  it('reverses chars in each word', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ReverseTextInWord page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /original/i }), 'hello world');
    expect(screen.getByRole('textbox', { name: /each word reversed/i }).value).toBe('olleh dlrow');
  });
});

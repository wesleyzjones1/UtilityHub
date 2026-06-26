import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ReverseText from './ReverseText';

const PAGE = {
  id: 'reverse-text', title: 'Reverse Text',
  description: 'Reverse text.', category: 'text',
  path: '/tools/reverse-text',
};

describe('ReverseText', () => {
  it('renders the page title', () => {
    renderWithRouter(<ReverseText page={PAGE} />);
    expect(screen.getAllByText('Reverse Text').length).toBeGreaterThan(0);
  });

  it('reverses input text', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ReverseText page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /original/i }), 'hello');
    expect(screen.getByRole('textbox', { name: /reversed/i }).value).toBe('olleh');
  });

  it('shows empty output for empty input', () => {
    renderWithRouter(<ReverseText page={PAGE} />);
    expect(screen.getByRole('textbox', { name: /reversed/i }).value).toBe('');
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import RemoveTextFormatting from './RemoveTextFormatting';

const PAGE = {
  id: 'remove-text-formatting', title: 'Remove Text Formatting',
  description: 'Strip formatting.', category: 'text',
  path: '/tools/remove-text-formatting',
};

describe('RemoveTextFormatting', () => {
  it('renders title', () => {
    renderWithRouter(<RemoveTextFormatting page={PAGE} />);
    expect(screen.getAllByText('Remove Text Formatting').length).toBeGreaterThan(0);
  });

  it('strips markdown bold', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RemoveTextFormatting page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /formatted/i }), '**bold**');
    expect(screen.getByRole('textbox', { name: /plain text/i }).value).toBe('bold');
  });

  it('strips HTML tags', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RemoveTextFormatting page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /formatted/i }), '<b>bold</b>');
    expect(screen.getByRole('textbox', { name: /plain text/i }).value).toBe('bold');
  });
});

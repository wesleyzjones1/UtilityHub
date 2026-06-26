import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ItalicText from './ItalicText';

const PAGE = {
  id: 'italic-text', title: 'Italic Text Generator',
  description: 'Generate italic text.', category: 'text',
  path: '/tools/italic-text',
};

describe('ItalicText', () => {
  it('renders title', () => {
    renderWithRouter(<ItalicText page={PAGE} />);
    expect(screen.getAllByText('Italic Text Generator').length).toBeGreaterThan(0);
  });

  it('converts to italic Unicode characters', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ItalicText page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'a');
    const output = screen.getByRole('textbox', { name: /italic/i }).value;
    expect(output.codePointAt(0)).toBe(0x1D44E);
  });
});

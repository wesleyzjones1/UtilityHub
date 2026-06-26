import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import BoldText from './BoldText';

const PAGE = {
  id: 'bold-text', title: 'Bold Text Generator',
  description: 'Generate bold text.', category: 'text',
  path: '/tools/bold-text',
};

describe('BoldText', () => {
  it('renders title', () => {
    renderWithRouter(<BoldText page={PAGE} />);
    expect(screen.getAllByText('Bold Text Generator').length).toBeGreaterThan(0);
  });

  it('converts to bold Unicode characters', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BoldText page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'a');
    const output = screen.getByRole('textbox', { name: /bold/i }).value;
    expect(output.codePointAt(0)).toBe(0x1D41A);
  });

  it('shows empty output for empty input', () => {
    renderWithRouter(<BoldText page={PAGE} />);
    expect(screen.getByRole('textbox', { name: /bold/i }).value).toBe('');
  });
});

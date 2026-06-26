import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import StrikethroughText from './StrikethroughText';

const PAGE = {
  id: 'strikethrough-text', title: 'Strikethrough Text Generator',
  description: 'Strikethrough text.', category: 'text',
  path: '/tools/strikethrough-text',
};

describe('StrikethroughText', () => {
  it('renders title', () => {
    renderWithRouter(<StrikethroughText page={PAGE} />);
    expect(screen.getAllByText('Strikethrough Text Generator').length).toBeGreaterThan(0);
  });

  it('adds combining overlay characters', async () => {
    const user = userEvent.setup();
    renderWithRouter(<StrikethroughText page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'ab');
    const outputEl = screen.getByRole('textbox', { name: /strikethrough/i });
    expect([...outputEl.value].length).toBe(4);
  });
});

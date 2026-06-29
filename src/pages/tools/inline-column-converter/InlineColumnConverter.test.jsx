import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import InlineColumnConverter from './InlineColumnConverter';

const PAGE = {
  id: 'inline-column-converter', title: 'Inline / Column Converter',
  description: 'Convert between column and inline.', category: 'text',
  path: '/tools/inline-column-converter',
};

describe('InlineColumnConverter', () => {
  it('renders title', () => {
    renderWithRouter(<InlineColumnConverter page={PAGE} />);
    expect(screen.getAllByText('Inline / Column Converter').length).toBeGreaterThan(0);
  });

  it('converts column to inline by default', async () => {
    const user = userEvent.setup();
    renderWithRouter(<InlineColumnConverter page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /column/i }), 'a\nb\nc');
    const output = screen.getByRole('textbox', { name: /inline/i }).value;
    expect(output).toContain('a');
    expect(output).toContain('b');
    expect(output).toContain('c');
  });

  it('renders the direction buttons', () => {
    renderWithRouter(<InlineColumnConverter page={PAGE} />);
    expect(screen.getByRole('button', { name: 'Column → Inline' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Inline → Column' })).toBeDefined();
  });

  it('renders the separator select', () => {
    renderWithRouter(<InlineColumnConverter page={PAGE} />);
    expect(screen.getByRole('combobox')).toBeDefined();
  });
});

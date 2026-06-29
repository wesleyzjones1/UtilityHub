import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import BaseConverter from './BaseConverter';

const PAGE = {
  id: 'base-converter', title: 'Base Converter',
  description: 'Convert between number bases.', category: 'math',
  path: '/tools/base-converter',
};

describe('BaseConverter', () => {
  it('renders title', () => {
    renderWithRouter(<BaseConverter page={PAGE} />);
    expect(screen.getAllByText('Base Converter').length).toBeGreaterThan(0);
  });

  it('renders From and To dropdowns', () => {
    renderWithRouter(<BaseConverter page={PAGE} />);
    expect(screen.getByRole('combobox', { name: /from/i })).toBeDefined();
    expect(screen.getByRole('combobox', { name: /to/i })).toBeDefined();
  });

  it('converts decimal 10 to binary 1010', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BaseConverter page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), '10');
    expect(screen.getByRole('textbox', { name: /result/i }).value).toBe('1010');
  });

  it('shows error for invalid binary input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BaseConverter page={PAGE} />);
    // switch From to binary
    await user.selectOptions(screen.getByRole('combobox', { name: /from/i }), 'binary');
    await user.selectOptions(screen.getByRole('combobox', { name: /to/i }), 'decimal');
    await user.type(screen.getByRole('textbox', { name: /input/i }), '9');
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('converts text to hex', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BaseConverter page={PAGE} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /from/i }), 'text');
    await user.selectOptions(screen.getByRole('combobox', { name: /to/i }), 'hexadecimal');
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'A');
    expect(screen.getByRole('textbox', { name: /result/i }).value).toBe('41');
  });

  it('shows empty output for empty input', () => {
    renderWithRouter(<BaseConverter page={PAGE} />);
    expect(screen.getByRole('textbox', { name: /result/i }).value).toBe('');
  });
});

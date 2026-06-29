import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
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

  it('renders From and To button groups', () => {
    renderWithRouter(<BaseConverter page={PAGE} />);
    expect(screen.getByRole('group', { name: /from/i })).toBeDefined();
    expect(screen.getByRole('group', { name: /to/i })).toBeDefined();
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
    const fromGroup = screen.getByRole('group', { name: /from/i });
    const toGroup = screen.getByRole('group', { name: /to/i });
    await user.click(within(fromGroup).getByRole('button', { name: 'Binary' }));
    await user.click(within(toGroup).getByRole('button', { name: 'Decimal' }));
    await user.type(screen.getByRole('textbox', { name: /input/i }), '9');
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('converts text to hex', async () => {
    const user = userEvent.setup();
    renderWithRouter(<BaseConverter page={PAGE} />);
    const fromGroup = screen.getByRole('group', { name: /from/i });
    const toGroup = screen.getByRole('group', { name: /to/i });
    await user.click(within(fromGroup).getByRole('button', { name: 'Text' }));
    await user.click(within(toGroup).getByRole('button', { name: 'Hex' }));
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'A');
    expect(screen.getByRole('textbox', { name: /result/i }).value).toBe('41');
  });

  it('shows empty output for empty input', () => {
    renderWithRouter(<BaseConverter page={PAGE} />);
    expect(screen.getByRole('textbox', { name: /result/i }).value).toBe('');
  });
});

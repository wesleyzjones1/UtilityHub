import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import NumberSorter from './NumberSorter';

const PAGE = {
  id: 'number-sorter', title: 'Number Sorter',
  description: 'Sort numbers.', category: 'math',
  path: '/tools/number-sorter',
};

describe('NumberSorter', () => {
  it('renders title', () => {
    renderWithRouter(<NumberSorter page={PAGE} />);
    expect(screen.getAllByText('Number Sorter').length).toBeGreaterThan(0);
  });

  it('sorts numbers ascending by default', async () => {
    const user = userEvent.setup();
    renderWithRouter(<NumberSorter page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /numbers/i }), '3{Enter}1{Enter}2');
    const output = screen.getByRole('textbox', { name: /sorted/i }).value;
    expect(output).toBe('1\n2\n3');
  });

  it('sorts descending when changed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<NumberSorter page={PAGE} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /order/i }), 'desc');
    await user.type(screen.getByRole('textbox', { name: /numbers/i }), '1{Enter}3{Enter}2');
    const output = screen.getByRole('textbox', { name: /sorted/i }).value;
    expect(output).toBe('3\n2\n1');
  });

  it('removes duplicates when toggled', async () => {
    const user = userEvent.setup();
    renderWithRouter(<NumberSorter page={PAGE} />);
    await user.click(screen.getByRole('switch'));
    await user.type(screen.getByRole('textbox', { name: /numbers/i }), '1{Enter}1{Enter}2');
    const output = screen.getByRole('textbox', { name: /sorted/i }).value;
    expect(output).toBe('1\n2');
  });

  it('shows empty output for empty input', () => {
    renderWithRouter(<NumberSorter page={PAGE} />);
    expect(screen.getByRole('textbox', { name: /sorted/i }).value).toBe('');
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import RandomNumber from './RandomNumber';

const PAGE = {
  id: 'random-number',
  title: 'Random Number Generator',
  description: 'Generate random integers or decimals within a custom range.',
  category: 'math',
  path: '/tools/random-number',
};

describe('RandomNumber', () => {
  it('renders the title', () => {
    renderWithRouter(<RandomNumber page={PAGE} />);
    expect(screen.getAllByText('Random Number Generator').length).toBeGreaterThan(0);
  });

  it('shows placeholder text initially', () => {
    renderWithRouter(<RandomNumber page={PAGE} />);
    expect(screen.getByText('Click Generate to get numbers')).toBeDefined();
  });

  it('clicking Generate shows a number in the result', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RandomNumber page={PAGE} />);
    await user.click(screen.getByRole('button', { name: /generate/i }));
    expect(screen.queryByText('Click Generate to get numbers')).toBeNull();
    const pre = document.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre.textContent.trim()).toMatch(/[\d.]+/);
  });

  it('changing count to 5 and clicking Generate shows multiple numbers', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RandomNumber page={PAGE} />);
    const countInput = screen.getByRole('spinbutton', { name: /count/i });
    await user.clear(countInput);
    await user.type(countInput, '5');
    await user.click(screen.getByRole('button', { name: /generate/i }));
    const pre = document.querySelector('pre');
    expect(pre).not.toBeNull();
    const lines = pre.textContent.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(5);
  });
});

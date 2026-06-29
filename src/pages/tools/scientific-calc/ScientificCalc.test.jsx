import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ScientificCalc from './ScientificCalc';

const PAGE = {
  id: 'scientific-calc',
  title: 'Scientific Calculator',
  description: 'Full-featured scientific calculator with trigonometry and logarithms.',
  category: 'math',
  path: '/tools/scientific-calc',
};

describe('ScientificCalc', () => {
  it('renders the title', () => {
    renderWithRouter(<ScientificCalc page={PAGE} />);
    expect(screen.getAllByText('Scientific Calculator').length).toBeGreaterThan(0);
  });

  it('clicking 5, ×, 3, = shows 15 in the display', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ScientificCalc page={PAGE} />);
    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '×' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByLabelText('Display').textContent).toBe('15');
  });

  it('clicking AC clears the display', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ScientificCalc page={PAGE} />);
    await user.click(screen.getByRole('button', { name: '9' }));
    await user.click(screen.getByRole('button', { name: 'AC' }));
    expect(screen.getByLabelText('Display').textContent).toBe('0');
  });

  it('clicking π shows pi value in display', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ScientificCalc page={PAGE} />);
    await user.click(screen.getByRole('button', { name: 'π' }));
    await user.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByLabelText('Display').textContent).toMatch(/^3\.14/);
  });
});

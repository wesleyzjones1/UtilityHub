import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import StatisticsCalc from './StatisticsCalc';

const PAGE = {
  id: 'statistics-calc',
  title: 'Statistics Calculator',
  description: 'Compute mean, median, mode, standard deviation, and more.',
  category: 'math',
  path: '/tools/statistics-calc',
};

describe('StatisticsCalc', () => {
  it('renders the title', () => {
    renderWithRouter(<StatisticsCalc page={PAGE} />);
    expect(screen.getAllByText('Statistics Calculator').length).toBeGreaterThan(0);
  });

  it('shows "—" for mean when input is empty', () => {
    renderWithRouter(<StatisticsCalc page={PAGE} />);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('shows correct mean and median for "1, 2, 3, 4, 5"', async () => {
    const user = userEvent.setup();
    renderWithRouter(<StatisticsCalc page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /numbers/i }), '1, 2, 3, 4, 5');
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import PercentageCalc from './PercentageCalc';

const PAGE = {
  id: 'percentage-calc', title: 'Percentage Calculator',
  description: 'Calculate percentages.', category: 'math', path: '/tools/percentage-calc',
};

describe('PercentageCalc', () => {
  it('renders the title', () => {
    renderWithRouter(<PercentageCalc page={PAGE} />);
    expect(screen.getAllByText('Percentage Calculator').length).toBeGreaterThan(0);
  });

  it('computes X% of Y', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PercentageCalc page={PAGE} />);
    await user.type(screen.getByLabelText('Percent'), '15');
    await user.type(screen.getByLabelText('Value'), '200');
    expect(screen.getByText('30')).toBeDefined();
  });

  it('shows the placeholder example answer as a hint before input', () => {
    renderWithRouter(<PercentageCalc page={PAGE} />);
    // Falls back to 15% of 200 = 30 instead of a bare dash.
    expect(screen.getByText('30')).toBeDefined();
    expect(screen.queryByText('—')).toBeNull();
  });
});

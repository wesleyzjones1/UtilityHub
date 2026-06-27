import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import DateCalculator from './DateCalculator';

const PAGE = { id: 'date-calculator', title: 'Date Calculator', description: 'Calculate the number of days between two dates.', category: 'time', path: '/tools/date-calculator' };

describe('DateCalculator', () => {
  it('renders the title', () => {
    renderWithRouter(<DateCalculator page={PAGE} />);
    expect(screen.getAllByText('Date Calculator').length).toBeGreaterThan(0);
  });

  it('shows a positive day count for default dates without NaN', () => {
    renderWithRouter(<DateCalculator page={PAGE} />);
    const text = document.body.textContent;
    expect(text).not.toContain('NaN');
    const daysEl = screen.getByLabelText('Copy days');
    expect(daysEl).toBeDefined();
  });

  it('shows correct days count for specific dates', async () => {
    const user = userEvent.setup();
    renderWithRouter(<DateCalculator page={PAGE} />);
    const startInput = screen.getByLabelText('Start date');
    const endInput = screen.getByLabelText('End date');
    await user.clear(startInput);
    await user.type(startInput, '2024-01-01');
    await user.clear(endInput);
    await user.type(endInput, '2024-01-31');
    expect(screen.getByText('30')).toBeDefined();
  });
});

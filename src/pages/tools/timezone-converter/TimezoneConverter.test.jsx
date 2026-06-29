import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import TimezoneConverter from './TimezoneConverter';

const PAGE = { id: 'timezone-converter', title: 'Timezone Converter', description: 'Convert a date and time between any two time zones.', category: 'time', path: '/tools/timezone-converter' };

describe('TimezoneConverter', () => {
  it('renders the title', () => {
    renderWithRouter(<TimezoneConverter page={PAGE} />);
    expect(screen.getAllByText('Timezone Converter').length).toBeGreaterThan(0);
  });

  it('from-timezone select exists and has UTC as an option', () => {
    renderWithRouter(<TimezoneConverter page={PAGE} />);
    const fromSelect = screen.getByLabelText('From timezone');
    expect(fromSelect).toBeDefined();
    const utcOption = Array.from(fromSelect.options).find(o => o.value === 'UTC');
    expect(utcOption).toBeDefined();
  });

  it('to-timezone select exists', () => {
    renderWithRouter(<TimezoneConverter page={PAGE} />);
    expect(screen.getByLabelText('To timezone')).toBeDefined();
  });

  it('changing from-timezone to a different value does not crash', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TimezoneConverter page={PAGE} />);
    const fromSelect = screen.getByLabelText('From timezone');
    await user.selectOptions(fromSelect, 'America/New_York');
    expect(fromSelect.value).toBe('America/New_York');
  });
});

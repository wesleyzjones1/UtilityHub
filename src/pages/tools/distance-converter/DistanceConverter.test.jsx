import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import DistanceConverter from './DistanceConverter';

const PAGE = {
  id: 'distance-converter', title: 'Distance Converter',
  description: 'Convert distance units.', category: 'math',
  path: '/tools/distance-converter',
};

describe('DistanceConverter', () => {
  it('renders title', () => {
    renderWithRouter(<DistanceConverter page={PAGE} />);
    expect(screen.getAllByText('Distance Converter').length).toBeGreaterThan(0);
  });

  it('renders From and To dropdowns', () => {
    renderWithRouter(<DistanceConverter page={PAGE} />);
    expect(screen.getByRole('combobox', { name: /from/i })).toBeDefined();
    expect(screen.getByRole('combobox', { name: /to/i })).toBeDefined();
  });

  it('converts 1 km to 1000 m', async () => {
    const user = userEvent.setup();
    renderWithRouter(<DistanceConverter page={PAGE} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /from/i }), 'km');
    await user.selectOptions(screen.getByRole('combobox', { name: /to/i }), 'm');
    await user.type(screen.getByRole('textbox', { name: /input/i }), '1');
    expect(screen.getByRole('textbox', { name: /result/i }).value).toBe('1000');
  });

  it('shows error for invalid input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<DistanceConverter page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /input/i }), 'abc');
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('shows empty output for empty input', () => {
    renderWithRouter(<DistanceConverter page={PAGE} />);
    expect(screen.getByRole('textbox', { name: /result/i }).value).toBe('');
  });
});

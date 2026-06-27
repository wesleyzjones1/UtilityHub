import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import UnitConverter from './UnitConverter';

const PAGE = {
  id: 'unit-converter', title: 'Unit Converter',
  description: 'Convert units.', category: 'math', path: '/tools/unit-converter',
};

describe('UnitConverter', () => {
  it('renders the title', () => {
    renderWithRouter(<UnitConverter page={PAGE} />);
    expect(screen.getAllByText('Unit Converter').length).toBeGreaterThan(0);
  });

  it('converts 1 m to ft by default', () => {
    renderWithRouter(<UnitConverter page={PAGE} />);
    // 1 metre ≈ 3.28084 ft
    expect(screen.getByText('3.28084')).toBeDefined();
  });

  it('updates the result when the value changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UnitConverter page={PAGE} />);
    const input = screen.getByLabelText('Value to convert');
    await user.clear(input);
    await user.type(input, '2');
    expect(screen.getByText('6.56168')).toBeDefined();
  });

  it('switches measurement category and resets units', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UnitConverter page={PAGE} />);
    await user.selectOptions(screen.getByLabelText('Measurement'), 'temperature');
    // Temperature units should now be available (in both the From and To selects).
    expect(screen.getAllByRole('option', { name: /celsius/i }).length).toBeGreaterThan(0);
  });

  it('converts temperature correctly', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UnitConverter page={PAGE} />);
    await user.selectOptions(screen.getByLabelText('Measurement'), 'temperature');
    // Defaults to Celsius → Fahrenheit; type 100 → 212
    const input = screen.getByLabelText('Value to convert');
    await user.clear(input);
    await user.type(input, '100');
    expect(screen.getByText('212')).toBeDefined();
  });
});

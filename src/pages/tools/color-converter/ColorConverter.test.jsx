import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ColorConverter from './ColorConverter';

const PAGE = {
  id: 'color-converter', title: 'Color Converter',
  description: 'Convert colors.', category: 'color', path: '/tools/color-converter',
};

describe('ColorConverter', () => {
  it('renders the title', () => {
    renderWithRouter(<ColorConverter page={PAGE} />);
    expect(screen.getAllByText('Color Converter').length).toBeGreaterThan(0);
  });

  it('shows RGB/HSL/HSV/CMYK for the default color', () => {
    renderWithRouter(<ColorConverter page={PAGE} />);
    // #3B82F6 → rgb(59, 130, 246)
    expect(screen.getByText('rgb(59, 130, 246)')).toBeDefined();
    expect(screen.getByText('HSL')).toBeDefined();
    expect(screen.getByText('HSV')).toBeDefined();
    expect(screen.getByText('CMYK')).toBeDefined();
  });

  it('recomputes when a new hex is typed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ColorConverter page={PAGE} />);
    const input = screen.getByLabelText('Hex value');
    await user.clear(input);
    await user.type(input, '#FF0000');
    expect(screen.getByText('rgb(255, 0, 0)')).toBeDefined();
  });

  it('shows an error for an invalid hex', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ColorConverter page={PAGE} />);
    const input = screen.getByLabelText('Hex value');
    await user.clear(input);
    await user.type(input, 'nope');
    expect(screen.getByRole('alert')).toBeDefined();
  });
});

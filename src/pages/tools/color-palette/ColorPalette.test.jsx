import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ColorPalette from './ColorPalette';

const PAGE = {
  id: 'color-palette',
  title: 'Color Palette Generator',
  description: 'Generate harmonious color palettes from a base color.',
  category: 'color',
  path: '/tools/color-palette',
};

describe('ColorPalette', () => {
  it('renders the title', () => {
    renderWithRouter(<ColorPalette page={PAGE} />);
    expect(screen.getAllByText('Color Palette Generator').length).toBeGreaterThan(0);
  });

  it('default shows complementary scheme with exactly 2 swatches', () => {
    renderWithRouter(<ColorPalette page={PAGE} />);
    expect(screen.getAllByLabelText('Color swatch').length).toBe(2);
  });

  it('changing scheme to "triadic" shows 3 swatches', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ColorPalette page={PAGE} />);
    await user.selectOptions(screen.getByLabelText('Color scheme'), 'triadic');
    expect(screen.getAllByLabelText('Color swatch').length).toBe(3);
  });

  it('changing scheme to "monochromatic" shows 5 swatches', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ColorPalette page={PAGE} />);
    await user.selectOptions(screen.getByLabelText('Color scheme'), 'monochromatic');
    expect(screen.getAllByLabelText('Color swatch').length).toBe(5);
  });
});

import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
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

  it('default shows complementary scheme with the chosen color count', () => {
    renderWithRouter(<ColorPalette page={PAGE} />);
    // Default count is 5: base color + 4 complementary variations.
    expect(screen.getAllByLabelText('Color swatch').length).toBe(5);
  });

  it('changing scheme to "triadic" shows 3 swatches and hides the count field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ColorPalette page={PAGE} />);
    await user.selectOptions(screen.getByLabelText('Color scheme'), 'triadic');
    expect(screen.getAllByLabelText('Color swatch').length).toBe(3);
    expect(screen.queryByLabelText('Number of colors')).toBeNull();
  });

  it('changing scheme to "monochromatic" shows 5 swatches', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ColorPalette page={PAGE} />);
    await user.selectOptions(screen.getByLabelText('Color scheme'), 'monochromatic');
    expect(screen.getAllByLabelText('Color swatch').length).toBe(5);
  });

  it('changing the color count updates the number of swatches', () => {
    renderWithRouter(<ColorPalette page={PAGE} />);
    const countInput = screen.getByLabelText('Number of colors');
    fireEvent.change(countInput, { target: { value: '3' } });
    expect(screen.getAllByLabelText('Color swatch').length).toBe(3);
  });
});

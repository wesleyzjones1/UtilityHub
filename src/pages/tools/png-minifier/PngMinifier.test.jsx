import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import PngMinifier from './PngMinifier';

const PAGE = {
  id: 'png-minifier', title: 'PNG Minifier', description: 'Reduce PNG file size.',
  category: 'image', path: '/tools/png-minifier',
};

describe('PngMinifier', () => {
  it('renders title', () => {
    renderWithRouter(<PngMinifier page={PAGE} />);
    expect(screen.getAllByText('PNG Minifier').length).toBeGreaterThan(0);
  });

  it('renders scale slider', () => {
    renderWithRouter(<PngMinifier page={PAGE} />);
    expect(screen.getByRole('slider', { name: /scale percentage/i })).toBeDefined();
  });

  it('scale slider defaults to 100', () => {
    renderWithRouter(<PngMinifier page={PAGE} />);
    const slider = screen.getByRole('slider', { name: /scale percentage/i });
    expect(slider.value).toBe('100');
  });

  it('renders drop zone', () => {
    renderWithRouter(<PngMinifier page={PAGE} />);
    expect(screen.getAllByText(/drop a png image/i).length).toBeGreaterThan(0);
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import PngToJpg from './PngToJpg';

const PAGE = {
  id: 'png-to-jpg', title: 'PNG to JPG', description: 'Convert PNG to JPEG.',
  category: 'image', path: '/tools/png-to-jpg',
};

describe('PngToJpg', () => {
  it('renders title', () => {
    renderWithRouter(<PngToJpg page={PAGE} />);
    expect(screen.getAllByText('PNG to JPG').length).toBeGreaterThan(0);
  });

  it('renders quality slider', () => {
    renderWithRouter(<PngToJpg page={PAGE} />);
    expect(screen.getByRole('slider', { name: /jpeg quality/i })).toBeDefined();
  });

  it('quality slider defaults to 90', () => {
    renderWithRouter(<PngToJpg page={PAGE} />);
    const slider = screen.getByRole('slider', { name: /jpeg quality/i });
    expect(slider.value).toBe('90');
  });

  it('renders drop zone', () => {
    renderWithRouter(<PngToJpg page={PAGE} />);
    expect(screen.getAllByText(/drop a png image/i).length).toBeGreaterThan(0);
  });
});

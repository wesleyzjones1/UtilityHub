import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import SvgToPng from './SvgToPng';

const PAGE = {
  id: 'svg-to-png', title: 'SVG to PNG', description: 'Convert SVG to PNG.',
  category: 'image', path: '/tools/svg-to-png',
};

describe('SvgToPng', () => {
  it('renders title', () => {
    renderWithRouter(<SvgToPng page={PAGE} />);
    expect(screen.getAllByText('SVG to PNG').length).toBeGreaterThan(0);
  });

  it('renders drop zone', () => {
    renderWithRouter(<SvgToPng page={PAGE} />);
    expect(screen.getAllByText(/drop an svg file/i).length).toBeGreaterThan(0);
  });

  it('renders how-to steps', () => {
    renderWithRouter(<SvgToPng page={PAGE} />);
    expect(screen.getAllByText(/drop an svg file/i).length).toBeGreaterThan(0);
  });
});

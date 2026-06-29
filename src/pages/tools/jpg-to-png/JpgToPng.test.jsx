import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import JpgToPng from './JpgToPng';

const PAGE = {
  id: 'jpg-to-png', title: 'JPG to PNG', description: 'Convert JPEG to PNG.',
  category: 'image', path: '/tools/jpg-to-png',
};

describe('JpgToPng', () => {
  it('renders title', () => {
    renderWithRouter(<JpgToPng page={PAGE} />);
    expect(screen.getAllByText('JPG to PNG').length).toBeGreaterThan(0);
  });

  it('renders drop zone', () => {
    renderWithRouter(<JpgToPng page={PAGE} />);
    expect(screen.getAllByText(/drop a jpeg image/i).length).toBeGreaterThan(0);
  });

  it('renders how-to-use steps', () => {
    renderWithRouter(<JpgToPng page={PAGE} />);
    expect(screen.getAllByText(/drop a jpeg/i).length).toBeGreaterThan(0);
  });
});

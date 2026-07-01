import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import ImageResizer from './ImageResizer';

const PAGE = {
  id: 'image-resizer', title: 'Image Resizer', description: 'Resize images.',
  category: 'image', path: '/tools/image-resizer',
};

describe('ImageResizer', () => {
  it('renders title', () => {
    renderWithRouter(<ImageResizer page={PAGE} />);
    expect(screen.getAllByText('Image Resizer').length).toBeGreaterThan(0);
  });

  it('renders drop zone', () => {
    renderWithRouter(<ImageResizer page={PAGE} />);
    expect(screen.getByText(/drop an image here/i)).toBeDefined();
  });

});

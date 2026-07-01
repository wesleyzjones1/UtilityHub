import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import ImageCropper from './ImageCropper';

const PAGE = {
  id: 'image-cropper', title: 'Image Cropper', description: 'Crop images.',
  category: 'image', path: '/tools/image-cropper',
};

describe('ImageCropper', () => {
  it('renders title', () => {
    renderWithRouter(<ImageCropper page={PAGE} />);
    expect(screen.getAllByText('Image Cropper').length).toBeGreaterThan(0);
  });

  it('renders drop zone before a file is loaded', () => {
    renderWithRouter(<ImageCropper page={PAGE} />);
    expect(screen.getByText(/drop an image here/i)).toBeDefined();
  });

});

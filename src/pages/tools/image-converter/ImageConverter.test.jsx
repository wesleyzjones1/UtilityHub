import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ImageConverter from './ImageConverter';

const PAGE = {
  id: 'image-converter', title: 'Image Converter',
  description: 'Convert images between formats.', category: 'image', path: '/tools/image-converter',
};

describe('ImageConverter', () => {
  it('renders title', () => {
    renderWithRouter(<ImageConverter page={PAGE} />);
    expect(screen.getAllByText('Image Converter').length).toBeGreaterThan(0);
  });

  it('renders the drop zone', () => {
    renderWithRouter(<ImageConverter page={PAGE} />);
    expect(screen.getAllByText(/drop an image here/i).length).toBeGreaterThan(0);
  });

  it('offers PNG, JPG, and WEBP output formats', () => {
    renderWithRouter(<ImageConverter page={PAGE} />);
    expect(screen.getByRole('button', { name: 'PNG' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'JPG' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'WEBP' })).toBeDefined();
  });

  it('shows a quality slider only for lossy formats', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ImageConverter page={PAGE} />);
    // PNG is selected by default → no quality slider.
    expect(screen.queryByRole('slider', { name: /image quality/i })).toBeNull();
    // Switching to JPG reveals it.
    await user.click(screen.getByRole('button', { name: 'JPG' }));
    expect(screen.getByRole('slider', { name: /image quality/i })).toBeDefined();
  });
});

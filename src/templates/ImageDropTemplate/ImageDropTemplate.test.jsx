import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '../../test-utils';
import ImageDropTemplate from './ImageDropTemplate';

const mockPage = {
  id: 'image-resizer',
  title: 'Image Resizer',
  description: 'Resize images in the browser.',
  category: 'web',
  path: '/tools/image-resizer',
  keywords: [],
};

function renderTemplate(props = {}) {
  return renderWithRouter(<ImageDropTemplate page={mockPage} {...props} />);
}

describe('ImageDropTemplate', () => {
  it('renders page title', () => {
    renderTemplate();
    expect(screen.getByRole('heading', { level: 1, name: 'Image Resizer' })).toBeInTheDocument();
  });

  it('renders the drop zone', () => {
    renderTemplate();
    expect(screen.getByRole('button', { name: /drop an image/i })).toBeInTheDocument();
  });

  it('renders topControls', () => {
    renderTemplate({ topControls: <label>Width: <input type="number" /></label> });
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('renders actions', () => {
    renderTemplate({ actions: <button>Resize</button> });
    expect(screen.getByRole('button', { name: 'Resize' })).toBeInTheDocument();
  });

  it('renders children (extras)', () => {
    renderTemplate({ children: <p>Extra options here</p> });
    expect(screen.getByText('Extra options here')).toBeInTheDocument();
  });

  it('calls onFile when file is dropped', () => {
    const onFile = vi.fn();
    URL.createObjectURL.mockReturnValue('blob:mock');
    renderTemplate({ onFile });
    const zone = screen.getByRole('button', { name: /drop an image/i });
    const file = new File(['img'], 'test.png', { type: 'image/png' });
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFile).toHaveBeenCalledWith(file);
  });

  it('renders how-to-use steps', () => {
    renderTemplate({ howToUse: ['Drop an image', 'Set dimensions', 'Download'] });
    expect(screen.getByText('Drop an image')).toBeInTheDocument();
  });
});

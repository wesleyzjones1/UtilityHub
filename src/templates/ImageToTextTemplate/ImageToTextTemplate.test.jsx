import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '../../test-utils';
import ImageToTextTemplate from './ImageToTextTemplate';

const mockPage = {
  id: 'image-base64',
  title: 'Image to Base64',
  description: 'Convert images to Base64 strings.',
  category: 'web',
  path: '/tools/image-base64',
  keywords: [],
};

function renderTemplate(props = {}) {
  return renderWithRouter(<ImageToTextTemplate page={mockPage} {...props} />);
}

describe('ImageToTextTemplate', () => {
  it('renders page title', () => {
    renderTemplate();
    expect(screen.getByRole('heading', { level: 1, name: 'Image to Base64' })).toBeInTheDocument();
  });

  it('renders the image drop zone', () => {
    renderTemplate();
    expect(screen.getByRole('button', { name: /drop an image/i })).toBeInTheDocument();
  });

  it('renders output textarea', () => {
    renderTemplate({ output: 'data:image/png;base64,abc123' });
    const textareas = screen.getAllByRole('textbox');
    const readOnly = textareas.find(t => t.readOnly);
    expect(readOnly.value).toBe('data:image/png;base64,abc123');
  });

  it('shows copy button when output is non-empty', () => {
    renderTemplate({ output: 'base64data' });
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('does not show copy button when output is empty', () => {
    renderTemplate({ output: '' });
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
  });

  it('calls onFile when file dropped', () => {
    const onFile = vi.fn();
    URL.createObjectURL.mockReturnValue('blob:mock');
    renderTemplate({ onFile });
    const zone = screen.getByRole('button', { name: /drop an image/i });
    const file = new File(['img'], 'test.png', { type: 'image/png' });
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFile).toHaveBeenCalledWith(file);
  });

  it('renders topControls', () => {
    renderTemplate({ topControls: <button>Encode</button> });
    expect(screen.getByRole('button', { name: 'Encode' })).toBeInTheDocument();
  });

  it('renders actions', () => {
    renderTemplate({ actions: <button>Download</button> });
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
  });

});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders as render } from '../../../test-utils';
import ImageDropZone from './ImageDropZone';

function makeFile(name = 'photo.png', type = 'image/png', size = 1024) {
  const file = new File(['x'.repeat(size)], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('ImageDropZone', () => {
  beforeEach(() => {
    URL.createObjectURL.mockReturnValue('blob:mock-url');
  });

  it('renders drop zone with default label', () => {
    render(<ImageDropZone />);
    expect(screen.getByText('Drop an image here')).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(<ImageDropZone label="Drop image" sublabel="PNG or JPG" />);
    expect(screen.getByText('Drop image')).toBeInTheDocument();
    expect(screen.getByText('PNG or JPG')).toBeInTheDocument();
  });

  it('calls onFile with dropped file', () => {
    const onFile = vi.fn();
    render(<ImageDropZone onFile={onFile} />);
    const zone = screen.getByRole('button');
    const file = makeFile();
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFile).toHaveBeenCalledWith(file);
  });

  it('shows file name and size after drop', () => {
    render(<ImageDropZone />);
    const zone = screen.getByRole('button');
    const file = makeFile('my-image.png', 'image/png', 2048);
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(screen.getByText('my-image.png')).toBeInTheDocument();
  });

  it('shows error when file exceeds maxSizeBytes', () => {
    render(<ImageDropZone maxSizeBytes={100} />);
    const zone = screen.getByRole('button');
    const file = makeFile('big.png', 'image/png', 200);
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/too large/i)).toBeInTheDocument();
  });

  it('calls onClear and resets state when clear button clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<ImageDropZone onClear={onClear} />);
    const zone = screen.getByRole('button');
    const file = makeFile();
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    await user.click(screen.getByRole('button', { name: 'Remove file' }));
    expect(onClear).toHaveBeenCalled();
    expect(screen.getByText('Drop an image here')).toBeInTheDocument();
  });

  it('shows dragging state label on drag enter', () => {
    render(<ImageDropZone />);
    const zone = screen.getByRole('button');
    fireEvent.dragEnter(zone);
    expect(screen.getByText('Release to upload')).toBeInTheDocument();
  });

  it('reverts to normal label on drag leave', () => {
    render(<ImageDropZone />);
    const zone = screen.getByRole('button');
    fireEvent.dragEnter(zone);
    fireEvent.dragLeave(zone);
    expect(screen.getByText('Drop an image here')).toBeInTheDocument();
  });

  it('uses controlled file prop', () => {
    const file = makeFile('controlled.png');
    render(<ImageDropZone file={file} />);
    expect(screen.getByText('controlled.png')).toBeInTheDocument();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import VideoToGif from './VideoToGif';

const PAGE = {
  id: 'video-to-gif',
  title: 'Video to GIF',
  description: 'Convert a video to an animated GIF.',
  category: 'image',
  path: '/tools/video-to-gif',
};

beforeEach(() => {
  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = vi.fn();
});

function fileInput() {
  return document.querySelector('input[type="file"]');
}

function selectVideo() {
  const video = new File(['fake-bytes'], 'clip.mp4', { type: 'video/mp4' });
  fireEvent.change(fileInput(), { target: { files: [video] } });
}

describe('VideoToGif', () => {
  it('renders the title', () => {
    renderWithRouter(<VideoToGif page={PAGE} />);
    expect(screen.getAllByText('Video to GIF').length).toBeGreaterThan(0);
  });

  it('renders the file drop area', () => {
    renderWithRouter(<VideoToGif page={PAGE} />);
    expect(screen.getByText(/drop a video here/i)).toBeDefined();
  });

  it('does not show the Convert button before a file is selected', () => {
    renderWithRouter(<VideoToGif page={PAGE} />);
    expect(screen.queryByRole('button', { name: /convert to gif/i })).toBeNull();
  });

  it('shows the controls after a file is selected', async () => {
    const user = userEvent.setup();
    renderWithRouter(<VideoToGif page={PAGE} />);
    selectVideo();
    expect(screen.getByLabelText(/start/i)).toBeDefined();
    expect(screen.getByLabelText(/duration/i)).toBeDefined();
    expect(screen.getByLabelText(/frame rate/i)).toBeDefined();
    expect(screen.getByLabelText(/width/i)).toBeDefined();
  });

  it('shows an enabled Convert button after a file is selected', async () => {
    const user = userEvent.setup();
    renderWithRouter(<VideoToGif page={PAGE} />);
    selectVideo();
    const btn = screen.getByRole('button', { name: /convert to gif/i });
    expect(btn.disabled).toBe(false);
  });

  it('enforces the 10 second maximum on the duration input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<VideoToGif page={PAGE} />);
    selectVideo();
    expect(screen.getByLabelText(/duration/i).getAttribute('max')).toBe('10');
  });

  it('clamps a duration typed above the maximum', async () => {
    const user = userEvent.setup();
    renderWithRouter(<VideoToGif page={PAGE} />);
    selectVideo();
    const input = screen.getByLabelText(/duration/i);
    await user.clear(input);
    await user.type(input, '50');
    expect(Number(input.value)).toBeLessThanOrEqual(10);
  });

  it('clears back to the empty drop state', async () => {
    const user = userEvent.setup();
    renderWithRouter(<VideoToGif page={PAGE} />);
    selectVideo();
    await user.click(screen.getByRole('button', { name: /remove file/i }));
    expect(screen.queryByRole('button', { name: /convert to gif/i })).toBeNull();
    expect(screen.getByText(/drop a video here/i)).toBeDefined();
  });
});

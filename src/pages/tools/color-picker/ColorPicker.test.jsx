import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ColorPicker from './ColorPicker';

const PAGE = {
  id: 'color-picker',
  title: 'Color Picker',
  description: 'Pick any color from your screen.',
  category: 'color',
  path: '/tools/color-picker',
};

describe('ColorPicker — EyeDropper not supported', () => {
  beforeEach(() => {
    delete window.EyeDropper;
  });

  it('renders title', () => {
    renderWithRouter(<ColorPicker page={PAGE} />);
    expect(screen.getAllByText('Color Picker').length).toBeGreaterThan(0);
  });

  it('shows unsupported message when EyeDropper API is absent', () => {
    renderWithRouter(<ColorPicker page={PAGE} />);
    expect(screen.getByText(/eyedropper api is not supported/i)).toBeDefined();
  });

  it('disables the pick button when unsupported', () => {
    renderWithRouter(<ColorPicker page={PAGE} />);
    const btn = screen.getByRole('button', { name: /pick a color/i });
    expect(btn.disabled).toBe(true);
  });
});

describe('ColorPicker — EyeDropper supported', () => {
  let mockOpen;

  beforeEach(() => {
    mockOpen = vi.fn();
    // Must be a real constructor: the component calls `new window.EyeDropper()`.
    window.EyeDropper = vi.fn(function () { this.open = mockOpen; });
  });

  afterEach(() => {
    delete window.EyeDropper;
    vi.restoreAllMocks();
  });

  it('enables the pick button when EyeDropper is available', () => {
    renderWithRouter(<ColorPicker page={PAGE} />);
    const btn = screen.getByRole('button', { name: /pick a color from the screen/i });
    expect(btn.disabled).toBe(false);
  });

  it('shows picked color values after a successful pick', async () => {
    mockOpen.mockResolvedValue({ sRGBHex: '#1a2b3c' });
    const user = userEvent.setup();
    renderWithRouter(<ColorPicker page={PAGE} />);
    await user.click(screen.getByRole('button', { name: /pick a color from the screen/i }));
    expect((await screen.findAllByText('#1A2B3C')).length).toBeGreaterThan(0);
    expect(screen.getByText(/rgb\(26, 43, 60\)/i)).toBeDefined();
  });

  it('shows HEX, RGB, HSL labels after a pick', async () => {
    mockOpen.mockResolvedValue({ sRGBHex: '#ff0000' });
    const user = userEvent.setup();
    renderWithRouter(<ColorPicker page={PAGE} />);
    await user.click(screen.getByRole('button', { name: /pick a color from the screen/i }));
    expect((await screen.findAllByText('#FF0000')).length).toBeGreaterThan(0);
    expect(screen.getByText('HEX')).toBeDefined();
    expect(screen.getByText('RGB')).toBeDefined();
    expect(screen.getByText('HSL')).toBeDefined();
  });

  it('does not show an error when user aborts the picker', async () => {
    mockOpen.mockRejectedValue(Object.assign(new Error('User aborted'), { name: 'AbortError' }));
    const user = userEvent.setup();
    renderWithRouter(<ColorPicker page={PAGE} />);
    await user.click(screen.getByRole('button', { name: /pick a color from the screen/i }));
    await new Promise(r => setTimeout(r, 50));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows an error message on non-abort failures', async () => {
    mockOpen.mockRejectedValue(new Error('Permission denied'));
    const user = userEvent.setup();
    renderWithRouter(<ColorPicker page={PAGE} />);
    await user.click(screen.getByRole('button', { name: /pick a color from the screen/i }));
    expect(await screen.findByRole('alert')).toBeDefined();
  });
});

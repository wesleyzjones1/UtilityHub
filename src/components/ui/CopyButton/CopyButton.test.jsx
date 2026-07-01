import { describe, it, expect, vi } from 'vitest';
import { screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders as render } from '../../../test-utils';
import CopyButton from './CopyButton';

describe('CopyButton', () => {
  it('renders with default label', () => {
    render(<CopyButton value="hello" />);
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<CopyButton value="hello" label="Copy output" />);
    expect(screen.getByRole('button', { name: 'Copy output' })).toBeInTheDocument();
  });

  it('is disabled when value is empty', () => {
    render(<CopyButton value="" />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is enabled when value is non-empty', () => {
    render(<CopyButton value="abc" />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('shows "Copied!" label after click', async () => {
    const user = userEvent.setup();
    render(<CopyButton value="test" />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('reverts to original label after 2s', async () => {
    vi.useFakeTimers();
    try {
      render(<CopyButton value="test" />);
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
      // flush async copy (microtasks)
      await act(async () => {});
      act(() => { vi.advanceTimersByTime(2100); });
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('applies size class', () => {
    const { container } = render(<CopyButton value="x" size="lg" />);
    expect(container.firstChild.className).toMatch('lg');
  });
});

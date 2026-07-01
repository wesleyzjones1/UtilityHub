import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import CountdownTimer from './CountdownTimer';

const PAGE = {
  id: 'countdown-timer',
  title: 'Countdown Timer',
  description: 'Full-screen countdown timer.',
  category: 'time',
  path: '/tools/countdown-timer',
};

function startTimer(value) {
  const input = screen.getByRole('textbox', { name: /timer duration/i });
  fireEvent.change(input, { target: { value } });
  fireEvent.submit(input.closest('form'));
}

afterEach(() => {
  vi.useRealTimers();
});

describe('CountdownTimer — setup screen', () => {
  it('renders the title', () => {
    renderWithRouter(<CountdownTimer page={PAGE} />);
    expect(screen.getAllByText('Countdown Timer').length).toBeGreaterThan(0);
  });

  it('renders the time input', () => {
    renderWithRouter(<CountdownTimer page={PAGE} />);
    expect(screen.getByRole('textbox', { name: /timer duration/i })).toBeDefined();
  });

  it('Start button is disabled when input is empty', () => {
    renderWithRouter(<CountdownTimer page={PAGE} />);
    expect(screen.getByRole('button', { name: /^start$/i }).disabled).toBe(true);
  });

  it('Start button is disabled for invalid input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CountdownTimer page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /timer duration/i }), 'abc');
    expect(screen.getByRole('button', { name: /^start$/i }).disabled).toBe(true);
  });

  it('Start button is enabled for valid numeric input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CountdownTimer page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /timer duration/i }), '5');
    expect(screen.getByRole('button', { name: /^start$/i }).disabled).toBe(false);
  });

  it('1 min example button fills the input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CountdownTimer page={PAGE} />);
    await user.click(screen.getByRole('button', { name: '1 min' }));
    expect(screen.getByRole('textbox', { name: /timer duration/i }).value).toBe('1');
  });

  it('5 min example button fills the input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CountdownTimer page={PAGE} />);
    await user.click(screen.getByRole('button', { name: '5 min' }));
    expect(screen.getByRole('textbox', { name: /timer duration/i }).value).toBe('5');
  });

  it('25 min example button fills the input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CountdownTimer page={PAGE} />);
    await user.click(screen.getByRole('button', { name: '25 min' }));
    expect(screen.getByRole('textbox', { name: /timer duration/i }).value).toBe('25');
  });

  it('30 sec example fills input with 0:30', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CountdownTimer page={PAGE} />);
    await user.click(screen.getByRole('button', { name: '30 sec' }));
    expect(screen.getByRole('textbox', { name: /timer duration/i }).value).toBe('0:30');
  });
});

describe('CountdownTimer — overlay', () => {
  it('shows the overlay after starting', () => {
    renderWithRouter(<CountdownTimer page={PAGE} />);
    startTimer('1');
    expect(screen.getByRole('dialog', { name: /countdown timer/i })).toBeDefined();
  });

  it('shows formatted time in the overlay', () => {
    renderWithRouter(<CountdownTimer page={PAGE} />);
    startTimer('1');
    // 1 minute = 60 seconds → 01:00
    expect(screen.getByText('01:00')).toBeDefined();
  });

  it('Stop button closes the overlay', () => {
    renderWithRouter(<CountdownTimer page={PAGE} />);
    startTimer('5');
    fireEvent.click(screen.getByRole('button', { name: /^stop$/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Escape key closes the overlay', () => {
    renderWithRouter(<CountdownTimer page={PAGE} />);
    startTimer('5');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Pause button toggles to Resume', () => {
    renderWithRouter(<CountdownTimer page={PAGE} />);
    startTimer('5');
    // Both the large timer face and the control bar expose a "Pause" button.
    fireEvent.click(screen.getAllByRole('button', { name: /^pause$/i })[0]);
    expect(screen.getAllByRole('button', { name: /^resume$/i }).length).toBeGreaterThan(0);
  });

  it('Space key pauses and resumes', () => {
    renderWithRouter(<CountdownTimer page={PAGE} />);
    startTimer('5');
    fireEvent.keyDown(window, { key: ' ' });
    expect(screen.getByText('Paused')).toBeDefined();
    fireEvent.keyDown(window, { key: ' ' });
    expect(screen.queryByText('Paused')).toBeNull();
  });

  it("shows \"Time's up!\" when timer reaches zero", () => {
    vi.useFakeTimers();
    renderWithRouter(<CountdownTimer page={PAGE} />);
    startTimer('0:30');
    act(() => { vi.advanceTimersByTime(31000); });
    expect(screen.getByText(/time'?s up/i)).toBeDefined();
  });

  it('shows Restart button when done', () => {
    vi.useFakeTimers();
    renderWithRouter(<CountdownTimer page={PAGE} />);
    startTimer('0:30');
    act(() => { vi.advanceTimersByTime(31000); });
    expect(screen.getByRole('button', { name: /restart/i })).toBeDefined();
  });
});

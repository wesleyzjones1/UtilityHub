import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from './SearchBar';

function Wrapped({ onClose } = {}) {
  return <MemoryRouter><SearchBar onClose={onClose} /></MemoryRouter>;
}

describe('SearchBar', () => {
  it('renders a search input', () => {
    render(<Wrapped />);
    expect(screen.getByRole('searchbox')).toBeDefined();
  });

  it('shows no results initially', () => {
    render(<Wrapped />);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('shows results when query matches a tool', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.type(screen.getByRole('searchbox'), 'json');
    expect(screen.getByRole('listbox')).toBeDefined();
    expect(screen.getByText('JSON Formatter')).toBeDefined();
  });

  it('shows empty state for no match', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.type(screen.getByRole('searchbox'), 'xyzzy_no_match');
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('clears results on Escape', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.type(screen.getByRole('searchbox'), 'json');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Wrapped onClose={onClose} />);
    await user.type(screen.getByRole('searchbox'), 'json');
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('clear button resets query', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.type(screen.getByRole('searchbox'), 'json');
    await user.click(screen.getByLabelText('Clear search'));
    expect(screen.getByRole('searchbox').value).toBe('');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('navigates results with arrow keys', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    const input = screen.getByRole('searchbox');
    await user.type(input, 'converter');
    const options = screen.getAllByRole('option');
    await user.keyboard('{ArrowDown}');
    expect(options[0].getAttribute('aria-selected')).toBe('true');
    await user.keyboard('{ArrowDown}');
    expect(options[1].getAttribute('aria-selected')).toBe('true');
    await user.keyboard('{ArrowUp}');
    expect(options[0].getAttribute('aria-selected')).toBe('true');
  });

  it('shows category label next to each result', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);
    await user.type(screen.getByRole('searchbox'), 'uuid');
    expect(screen.getByText('Web & Code')).toBeDefined();
  });
});

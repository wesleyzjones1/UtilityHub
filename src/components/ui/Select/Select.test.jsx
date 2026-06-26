import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from './Select';

const OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('Select', () => {
  it('renders all options', () => {
    render(<Select options={OPTIONS} value="a" onChange={vi.fn()} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('renders label and associates it with select', () => {
    render(<Select label="Sort by" options={OPTIONS} value="a" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
  });

  it('renders placeholder as first disabled option', () => {
    render(<Select placeholder="Choose…" options={OPTIONS} value="" onChange={vi.fn()} />);
    const placeholderOpt = screen.getByRole('option', { name: 'Choose…' });
    expect(placeholderOpt).toBeDisabled();
  });

  it('calls onChange with selected value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={OPTIONS} value="a" onChange={onChange} />);
    await user.selectOptions(screen.getByRole('combobox'), 'b');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('accepts string array options', () => {
    render(<Select options={['X', 'Y']} value="X" onChange={vi.fn()} />);
    expect(screen.getByRole('option', { name: 'X' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Y' })).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Select options={OPTIONS} value="a" onChange={vi.fn()} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});

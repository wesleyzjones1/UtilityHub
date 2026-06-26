import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Textarea from './Textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea aria-label="Input" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label and associates it', () => {
    render(<Textarea label="Your text" />);
    expect(screen.getByLabelText('Your text')).toBeInTheDocument();
  });

  it('calls onChange with string value when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label="Input" value="" onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hi');
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toBe('h');
  });

  it('shows placeholder', () => {
    render(<Textarea aria-label="Input" placeholder="Paste here…" />);
    expect(screen.getByPlaceholderText('Paste here…')).toBeInTheDocument();
  });

  it('is readonly when readOnly=true', () => {
    render(<Textarea aria-label="Input" readOnly value="frozen" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });

  it('shows character count when maxLength provided', () => {
    render(<Textarea label="Text" value="hello" maxLength={100} />);
    expect(screen.getByText(/5\s*\/\s*100/)).toBeInTheDocument();
  });

  it('shows over-limit count when over maxLength', () => {
    render(<Textarea label="Text" value={'x'.repeat(110)} maxLength={100} />);
    expect(screen.getByText(/110\s*\/\s*100/)).toBeInTheDocument();
  });

  it('applies mono class when mono=true', () => {
    render(<Textarea aria-label="Input" mono />);
    expect(screen.getByRole('textbox').className).toMatch('mono');
  });
});

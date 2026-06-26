import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('defaults to type=button', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Go</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled and shows aria-busy when loading', () => {
    render(<Button loading>Go</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('does not call onClick while loading', () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Go</Button>);
    // button is disabled (pointer-events:none); fireEvent bypasses CSS to confirm the handler isn't wired
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(['primary', 'secondary', 'ghost', 'danger'])('applies variant=%s class', (variant) => {
    const { container } = render(<Button variant={variant}>Go</Button>);
    expect(container.firstChild.className).toMatch(variant);
  });

  it.each(['sm', 'md', 'lg'])('applies size=%s class', (size) => {
    const { container } = render(<Button size={size}>Go</Button>);
    expect(container.firstChild.className).toMatch(size);
  });

  it('applies fullWidth class', () => {
    const { container } = render(<Button fullWidth>Go</Button>);
    expect(container.firstChild.className).toMatch('fullWidth');
  });

  it('renders iconLeft and iconRight', () => {
    render(
      <Button iconLeft={<span data-testid="left" />} iconRight={<span data-testid="right" />}>
        Go
      </Button>
    );
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('does not render icons while loading', () => {
    render(
      <Button loading iconLeft={<span data-testid="left" />}>
        Go
      </Button>
    );
    expect(screen.queryByTestId('left')).not.toBeInTheDocument();
  });

  it('accepts additional className', () => {
    const { container } = render(<Button className="my-extra">Go</Button>);
    expect(container.firstChild.className).toMatch('my-extra');
  });
});

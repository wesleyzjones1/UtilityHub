import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<EmptyState description="Add something to get started." />);
    expect(screen.getByText('Add something to get started.')).toBeInTheDocument();
  });

  it('renders icon slot', () => {
    render(<EmptyState icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action slot', () => {
    render(<EmptyState action={<button>Add item</button>} />);
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('has role=status for screen readers', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders nothing extra when no props passed', () => {
    const { container } = render(<EmptyState />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Panel from './Panel';

describe('Panel', () => {
  it('renders children', () => {
    render(<Panel>Content here</Panel>);
    expect(screen.getByText('Content here')).toBeInTheDocument();
  });

  it('renders as div by default', () => {
    const { container } = render(<Panel>Hello</Panel>);
    expect(container.firstChild.tagName).toBe('DIV');
  });

  it('renders as a custom element via as prop', () => {
    const { container } = render(<Panel as="section">Hello</Panel>);
    expect(container.firstChild.tagName).toBe('SECTION');
  });

  it.each(['default', 'filled', 'ghost'])('applies variant=%s class', (variant) => {
    const { container } = render(<Panel variant={variant}>Hi</Panel>);
    expect(container.firstChild.className).toMatch(variant);
  });

  it.each(['none', 'sm', 'md', 'lg'])('applies padding=%s class', (padding) => {
    const { container } = render(<Panel padding={padding}>Hi</Panel>);
    expect(container.firstChild.className).toMatch(`pad-${padding}`);
  });

  it('accepts additional className', () => {
    const { container } = render(<Panel className="extra">Hi</Panel>);
    expect(container.firstChild.className).toMatch('extra');
  });

  it('passes extra props to the element', () => {
    render(<Panel data-testid="my-panel">Hi</Panel>);
    expect(screen.getByTestId('my-panel')).toBeInTheDocument();
  });
});

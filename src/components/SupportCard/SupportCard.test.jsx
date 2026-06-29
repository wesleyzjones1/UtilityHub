import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SupportProvider } from '../../context/SupportContext';
import SupportCard from './SupportCard';

function Wrapped() {
  return (
    <SupportProvider>
      <SupportCard />
    </SupportProvider>
  );
}

describe('SupportCard', () => {
  it('states that the tool is free to use', () => {
    render(<Wrapped />);
    expect(screen.getByText(/free to use/i)).toBeDefined();
    expect(screen.queryByText(/runs entirely in your browser/i)).toBeNull();
  });

  it('exposes a Support action', () => {
    render(<Wrapped />);
    expect(screen.getByRole('button', { name: /support utilityhub/i })).toBeDefined();
  });
});

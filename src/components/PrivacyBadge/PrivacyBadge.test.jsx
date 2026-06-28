import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrivacyBadge from './PrivacyBadge';

describe('PrivacyBadge', () => {
  it('communicates that processing is local', () => {
    render(<PrivacyBadge />);
    expect(screen.getByText(/runs entirely in your browser/i)).toBeDefined();
  });
});

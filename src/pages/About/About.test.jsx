import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../test-utils';
import About from './About';

describe('About', () => {
  it('renders the heading', () => {
    renderWithRouter(<About />);
    expect(screen.getByRole('heading', { level: 1, name: /about utilityhub/i })).toBeDefined();
  });

  it('links to the source repository', () => {
    renderWithRouter(<About />);
    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link.getAttribute('href')).toMatch(/github\.com/i);
  });

  it('shows a "what\'s new" changelog', () => {
    renderWithRouter(<About />);
    expect(screen.getByText(/what's new/i)).toBeDefined();
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import EngineeringCheatSheet from './EngineeringCheatSheet';

const PAGE = {
  id: 'engineering-cheat-sheet', title: 'Engineering Cheat Sheet',
  description: 'Common engineering reference tables.', category: 'math',
  path: '/tools/engineering-cheat-sheet',
};

describe('EngineeringCheatSheet', () => {
  it('renders title', () => {
    renderWithRouter(<EngineeringCheatSheet page={PAGE} />);
    expect(screen.getAllByText('Engineering Cheat Sheet').length).toBeGreaterThan(0);
  });

  it('renders the SI Prefixes section', () => {
    renderWithRouter(<EngineeringCheatSheet page={PAGE} />);
    expect(screen.getByRole('region', { name: /si prefixes/i })).toBeDefined();
  });

  it('renders the Capacitor section', () => {
    renderWithRouter(<EngineeringCheatSheet page={PAGE} />);
    expect(screen.getByRole('region', { name: /capacitor/i })).toBeDefined();
  });

  it('renders the Frequency section', () => {
    renderWithRouter(<EngineeringCheatSheet page={PAGE} />);
    expect(screen.getByRole('region', { name: /frequency/i })).toBeDefined();
  });

  it('renders the Time Units section', () => {
    renderWithRouter(<EngineeringCheatSheet page={PAGE} />);
    expect(screen.getByRole('region', { name: /time units/i })).toBeDefined();
  });

  it('renders the Mass Units section', () => {
    renderWithRouter(<EngineeringCheatSheet page={PAGE} />);
    expect(screen.getByRole('region', { name: /mass units/i })).toBeDefined();
  });

  it('renders the Engineering Shorthand section', () => {
    renderWithRouter(<EngineeringCheatSheet page={PAGE} />);
    expect(screen.getByRole('region', { name: /shorthand/i })).toBeDefined();
  });

  it('contains Giga prefix data', () => {
    renderWithRouter(<EngineeringCheatSheet page={PAGE} />);
    expect(screen.getByText('Giga')).toBeDefined();
  });

  it('contains Ohm symbol', () => {
    renderWithRouter(<EngineeringCheatSheet page={PAGE} />);
    expect(screen.getByText('Ω')).toBeDefined();
  });
});

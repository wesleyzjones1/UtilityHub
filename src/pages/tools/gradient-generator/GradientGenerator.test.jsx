import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import GradientGenerator from './GradientGenerator';

const PAGE = {
  id: 'gradient-generator',
  title: 'Gradient Generator',
  description: 'Create and copy CSS gradient strings visually.',
  category: 'color',
  path: '/tools/gradient-generator',
};

describe('GradientGenerator', () => {
  it('renders the title', () => {
    renderWithRouter(<GradientGenerator page={PAGE} />);
    expect(screen.getAllByText('Gradient Generator').length).toBeGreaterThan(0);
  });

  it('CSS output contains "linear-gradient" by default', () => {
    renderWithRouter(<GradientGenerator page={PAGE} />);
    expect(screen.getByText(/linear-gradient/)).toBeDefined();
  });

  it('changing gradient type to "radial" updates the CSS output to contain "radial-gradient"', async () => {
    const user = userEvent.setup();
    renderWithRouter(<GradientGenerator page={PAGE} />);
    await user.selectOptions(screen.getByLabelText('Gradient type'), 'radial');
    expect(screen.getByText(/radial-gradient/)).toBeDefined();
  });

  it('clicking "Add stop" adds a new stop', async () => {
    const user = userEvent.setup();
    renderWithRouter(<GradientGenerator page={PAGE} />);
    const before = screen.getAllByLabelText(/Stop \d+ color/).length;
    await user.click(screen.getByText('Add stop'));
    const after = screen.getAllByLabelText(/Stop \d+ color/).length;
    expect(after).toBe(before + 1);
  });
});

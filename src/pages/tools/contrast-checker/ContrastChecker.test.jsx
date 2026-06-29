import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ContrastChecker from './ContrastChecker';

const PAGE = {
  id: 'contrast-checker', title: 'Contrast Checker',
  description: 'Check WCAG contrast.', category: 'color', path: '/tools/contrast-checker',
};

describe('ContrastChecker', () => {
  it('renders the title', () => {
    renderWithRouter(<ContrastChecker page={PAGE} />);
    expect(screen.getAllByText('Contrast Checker').length).toBeGreaterThan(0);
  });

  it('shows the maximum 21:1 ratio for black on white', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContrastChecker page={PAGE} />);
    await user.clear(screen.getByLabelText('Text color'));
    await user.type(screen.getByLabelText('Text color'), '#000000');
    expect(screen.getByText('21.00:1')).toBeDefined();
  });

  it('passes all grades for maximum contrast', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContrastChecker page={PAGE} />);
    await user.clear(screen.getByLabelText('Text color'));
    await user.type(screen.getByLabelText('Text color'), '#000000');
    expect(screen.getAllByText('Pass').length).toBe(4);
  });

  it('fails for a low-contrast pair', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContrastChecker page={PAGE} />);
    // White text on white background → 1:1
    await user.clear(screen.getByLabelText('Text color'));
    await user.type(screen.getByLabelText('Text color'), '#FFFFFF');
    expect(screen.getByText('1.00:1')).toBeDefined();
    expect(screen.getAllByText('Fail').length).toBe(4);
  });
});

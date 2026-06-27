import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import ArrayFormatter from './ArrayFormatter';

const PAGE = {
  id: 'array-formatter', title: 'Array Formatter',
  description: 'Format a list as a code array.', category: 'web',
  path: '/tools/array-formatter',
};

describe('ArrayFormatter', () => {
  it('renders title', () => {
    renderWithRouter(<ArrayFormatter page={PAGE} />);
    expect(screen.getAllByText('Array Formatter').length).toBeGreaterThan(0);
  });

  it('formats items as JS array by default', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ArrayFormatter page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /items/i }), 'a{Enter}b{Enter}c');
    expect(screen.getByRole('textbox', { name: /formatted/i }).value).toBe("['a', 'b', 'c']");
  });

  it('formats as JSON when selected', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ArrayFormatter page={PAGE} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /format/i }), 'json');
    await user.type(screen.getByRole('textbox', { name: /items/i }), 'x{Enter}y');
    expect(screen.getByRole('textbox', { name: /formatted/i }).value).toBe('["x","y"]');
  });

  it('uses double quotes when selected', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ArrayFormatter page={PAGE} />);
    await user.selectOptions(screen.getByRole('combobox', { name: /quote style/i }), 'double');
    await user.type(screen.getByRole('textbox', { name: /items/i }), 'a{Enter}b');
    expect(screen.getByRole('textbox', { name: /formatted/i }).value).toBe('["a", "b"]');
  });

  it('shows empty output for empty input', () => {
    renderWithRouter(<ArrayFormatter page={PAGE} />);
    expect(screen.getByRole('textbox', { name: /formatted/i }).value).toBe('');
  });
});

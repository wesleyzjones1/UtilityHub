import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import JsonFormatter from './JsonFormatter';

const PAGE = {
  id: 'json-formatter', title: 'JSON Formatter / Minifier',
  description: 'Format and minify JSON.', category: 'web',
  path: '/tools/json-formatter',
};

describe('JsonFormatter', () => {
  it('renders title', () => {
    renderWithRouter(<JsonFormatter page={PAGE} />);
    expect(screen.getAllByText('JSON Formatter / Minifier').length).toBeGreaterThan(0);
  });

  it('formats valid JSON', () => {
    renderWithRouter(<JsonFormatter page={PAGE} />);
    const input = screen.getByRole('textbox', { name: /json input/i });
    fireEvent.change(input, { target: { value: '{"a":1}' } });
    const output = screen.getByRole('textbox', { name: /json output/i });
    expect(output.value).toContain('"a": 1');
  });

  it('shows error for invalid JSON', () => {
    renderWithRouter(<JsonFormatter page={PAGE} />);
    const input = screen.getByRole('textbox', { name: /json input/i });
    fireEvent.change(input, { target: { value: 'not json' } });
    const output = screen.getByRole('textbox', { name: /json output/i });
    expect(output.value).toContain('Error');
  });

  it('minifies JSON when mode is minify', async () => {
    renderWithRouter(<JsonFormatter page={PAGE} />);
    const select = screen.getByRole('combobox', { name: /mode/i });
    await userEvent.selectOptions(select, 'minify');
    const input = screen.getByRole('textbox', { name: /json input/i });
    fireEvent.change(input, { target: { value: '{ "a": 1 }' } });
    const output = screen.getByRole('textbox', { name: /json output/i });
    expect(output.value).toBe('{"a":1}');
  });
});

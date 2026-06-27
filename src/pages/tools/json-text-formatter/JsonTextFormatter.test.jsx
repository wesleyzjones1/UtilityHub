import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import JsonTextFormatter from './JsonTextFormatter';

const PAGE = {
  id: 'json-text-formatter', title: 'JSON Text Formatter',
  description: 'Encode and decode JSON text strings.', category: 'web',
  path: '/tools/json-text-formatter',
};

describe('JsonTextFormatter', () => {
  it('renders title', () => {
    renderWithRouter(<JsonTextFormatter page={PAGE} />);
    expect(screen.getAllByText('JSON Text Formatter').length).toBeGreaterThan(0);
  });

  it('encodes text to JSON string', () => {
    renderWithRouter(<JsonTextFormatter page={PAGE} />);
    const input = screen.getByRole('textbox', { name: /plain text/i });
    fireEvent.change(input, { target: { value: 'hello world' } });
    const output = screen.getByRole('textbox', { name: /json string/i });
    expect(output.value).toBe('"hello world"');
  });

  it('decodes JSON string to plain text', async () => {
    renderWithRouter(<JsonTextFormatter page={PAGE} />);
    const select = screen.getByRole('combobox', { name: /mode/i });
    await userEvent.selectOptions(select, 'decode');
    const input = screen.getByRole('textbox', { name: /json string/i });
    fireEvent.change(input, { target: { value: '"hello world"' } });
    const output = screen.getByRole('textbox', { name: /plain text/i });
    expect(output.value).toBe('hello world');
  });
});

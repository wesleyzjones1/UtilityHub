import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import Base64 from './Base64';

const PAGE = {
  id: 'base64',
  title: 'Base64 Encoder / Decoder',
  description: 'Encode text or files to Base64 and decode Base64 strings.',
  category: 'web',
  path: '/tools/base64',
};

describe('Base64', () => {
  it('renders the title', () => {
    renderWithRouter(<Base64 page={PAGE} />);
    expect(screen.getAllByText('Base64 Encoder / Decoder').length).toBeGreaterThan(0);
  });

  it('encodes "Hello" to "SGVsbG8="', () => {
    renderWithRouter(<Base64 page={PAGE} />);
    const input = screen.getByRole('textbox', { name: /input/i });
    fireEvent.change(input, { target: { value: 'Hello' } });
    const output = screen.getByRole('textbox', { name: /output/i });
    expect(output.value).toBe('SGVsbG8=');
  });

  it('decodes "SGVsbG8=" to "Hello"', async () => {
    renderWithRouter(<Base64 page={PAGE} />);
    const modeSelect = screen.getByRole('combobox', { name: /mode/i });
    await userEvent.selectOptions(modeSelect, 'decode');
    const input = screen.getByRole('textbox', { name: /input/i });
    fireEvent.change(input, { target: { value: 'SGVsbG8=' } });
    const output = screen.getByRole('textbox', { name: /output/i });
    expect(output.value).toBe('Hello');
  });
});

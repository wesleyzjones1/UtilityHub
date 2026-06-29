import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import UrlEncoder from './UrlEncoder';

const PAGE = {
  id: 'url-encoder',
  title: 'URL Encoder / Decoder',
  description: 'Encode and decode URLs and query string components.',
  category: 'web',
  path: '/tools/url-encoder',
};

describe('UrlEncoder', () => {
  it('renders the title', () => {
    renderWithRouter(<UrlEncoder page={PAGE} />);
    expect(screen.getAllByText('URL Encoder / Decoder').length).toBeGreaterThan(0);
  });

  it('encodes "hello world" to "hello%20world"', () => {
    renderWithRouter(<UrlEncoder page={PAGE} />);
    const input = screen.getByRole('textbox', { name: /input/i });
    fireEvent.change(input, { target: { value: 'hello world' } });
    const output = screen.getByRole('textbox', { name: /output/i });
    expect(output.value).toBe('hello%20world');
  });

  it('decodes "hello%20world" to "hello world"', async () => {
    renderWithRouter(<UrlEncoder page={PAGE} />);
    const modeSelect = screen.getByRole('combobox', { name: /mode/i });
    await userEvent.selectOptions(modeSelect, 'decode');
    const input = screen.getByRole('textbox', { name: /input/i });
    fireEvent.change(input, { target: { value: 'hello%20world' } });
    const output = screen.getByRole('textbox', { name: /output/i });
    expect(output.value).toBe('hello world');
  });
});

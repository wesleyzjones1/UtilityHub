import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import XmlFormatter from './XmlFormatter';

const PAGE = {
  id: 'xml-formatter', title: 'XML Formatter / Minifier',
  description: 'Format and minify XML.', category: 'web',
  path: '/tools/xml-formatter',
};

describe('XmlFormatter', () => {
  it('renders title', () => {
    renderWithRouter(<XmlFormatter page={PAGE} />);
    expect(screen.getAllByText('XML Formatter / Minifier').length).toBeGreaterThan(0);
  });

  it('formats XML with indentation', () => {
    renderWithRouter(<XmlFormatter page={PAGE} />);
    const input = screen.getByRole('textbox', { name: /xml input/i });
    fireEvent.change(input, { target: { value: '<root><child>text</child></root>' } });
    const output = screen.getByRole('textbox', { name: /xml output/i });
    expect(output.value).toContain('  <child>');
  });

  it('minifies XML when mode is minify', async () => {
    renderWithRouter(<XmlFormatter page={PAGE} />);
    const select = screen.getByRole('combobox', { name: /mode/i });
    await userEvent.selectOptions(select, 'minify');
    const input = screen.getByRole('textbox', { name: /xml input/i });
    fireEvent.change(input, { target: { value: '<root>\n  <a>x</a>\n</root>' } });
    const output = screen.getByRole('textbox', { name: /xml output/i });
    expect(output.value).toBe('<root><a>x</a></root>');
  });
});

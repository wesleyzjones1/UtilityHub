import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import HtmlFormatter from './HtmlFormatter';

const PAGE = {
  id: 'html-formatter', title: 'HTML Formatter / Minifier',
  description: 'Format and minify HTML.', category: 'web',
  path: '/tools/html-formatter',
};

describe('HtmlFormatter', () => {
  it('renders title', () => {
    renderWithRouter(<HtmlFormatter page={PAGE} />);
    expect(screen.getAllByText('HTML Formatter / Minifier').length).toBeGreaterThan(0);
  });

  it('minifies HTML in minify mode', async () => {
    renderWithRouter(<HtmlFormatter page={PAGE} />);
    const select = screen.getByRole('combobox', { name: /mode/i });
    await userEvent.selectOptions(select, 'minify');
    const input = screen.getByRole('textbox', { name: /html input/i });
    fireEvent.change(input, { target: { value: '<div>  <p>hi</p>  </div>' } });
    const output = screen.getByRole('textbox', { name: /html output/i });
    expect(output.value).toBe('<div><p>hi</p></div>');
  });
});

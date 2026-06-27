import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import CssMinifier from './CssMinifier';

const PAGE = {
  id: 'css-minifier', title: 'CSS Formatter / Minifier',
  description: 'Format and minify CSS.', category: 'web',
  path: '/tools/css-minifier',
};

describe('CssMinifier', () => {
  it('renders title', () => {
    renderWithRouter(<CssMinifier page={PAGE} />);
    expect(screen.getAllByText('CSS Formatter / Minifier').length).toBeGreaterThan(0);
  });

  it('minifies CSS in minify mode', async () => {
    renderWithRouter(<CssMinifier page={PAGE} />);
    const select = screen.getByRole('combobox', { name: /mode/i });
    await userEvent.selectOptions(select, 'minify');
    const input = screen.getByRole('textbox', { name: /css input/i });
    fireEvent.change(input, { target: { value: 'body {\n  color: red;\n}' } });
    const output = screen.getByRole('textbox', { name: /css output/i });
    expect(output.value).toBe('body{color:red}');
  });
});

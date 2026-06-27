import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import JsFormatter from './JsFormatter';

const PAGE = {
  id: 'js-formatter', title: 'JavaScript Formatter / Minifier',
  description: 'Format and minify JavaScript.', category: 'web',
  path: '/tools/js-formatter',
};

describe('JsFormatter', () => {
  it('renders title', () => {
    renderWithRouter(<JsFormatter page={PAGE} />);
    expect(screen.getAllByText('JavaScript Formatter / Minifier').length).toBeGreaterThan(0);
  });

  it('minifies JS in minify mode', async () => {
    renderWithRouter(<JsFormatter page={PAGE} />);
    const select = screen.getByRole('combobox', { name: /mode/i });
    await userEvent.selectOptions(select, 'minify');
    const input = screen.getByRole('textbox', { name: /javascript input/i });
    fireEvent.change(input, { target: { value: '// comment\nconst x = 1;' } });
    const output = screen.getByRole('textbox', { name: /javascript output/i });
    expect(output.value).not.toContain('comment');
  });
});

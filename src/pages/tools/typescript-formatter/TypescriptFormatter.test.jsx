import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import TypescriptFormatter from './TypescriptFormatter';

const PAGE = {
  id: 'typescript-formatter', title: 'TypeScript Formatter / Minifier',
  description: 'Format and minify TypeScript.', category: 'web',
  path: '/tools/typescript-formatter',
};

describe('TypescriptFormatter', () => {
  it('renders title', () => {
    renderWithRouter(<TypescriptFormatter page={PAGE} />);
    expect(screen.getAllByText('TypeScript Formatter / Minifier').length).toBeGreaterThan(0);
  });

  it('minifies TS in minify mode', async () => {
    renderWithRouter(<TypescriptFormatter page={PAGE} />);
    const select = screen.getByRole('combobox', { name: /mode/i });
    await userEvent.selectOptions(select, 'minify');
    const input = screen.getByRole('textbox', { name: /typescript input/i });
    fireEvent.change(input, { target: { value: '// comment\nconst x: number = 1;' } });
    const output = screen.getByRole('textbox', { name: /typescript output/i });
    expect(output.value).not.toContain('comment');
  });
});

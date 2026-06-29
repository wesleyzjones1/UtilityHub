import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import MarkdownTable from './MarkdownTable';

const PAGE = {
  id: 'markdown-table', title: 'Markdown Table Generator',
  description: 'Generate a Markdown table from delimited data.', category: 'text',
  path: '/tools/markdown-table',
};

describe('MarkdownTable', () => {
  it('renders title', () => {
    renderWithRouter(<MarkdownTable page={PAGE} />);
    expect(screen.getAllByText('Markdown Table Generator').length).toBeGreaterThan(0);
  });

  it('renders separator dropdown', () => {
    renderWithRouter(<MarkdownTable page={PAGE} />);
    expect(screen.getByRole('combobox', { name: /separator/i })).toBeDefined();
  });

  it('generates table from CSV input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MarkdownTable page={PAGE} />);
    await user.type(
      screen.getByRole('textbox', { name: /delimited/i }),
      'Name,Age{Enter}Alice,30'
    );
    const output = screen.getByRole('textbox', { name: /markdown table/i }).value;
    expect(output).toContain('| Name');
    expect(output).toContain('| Alice');
    expect(output).toContain('---');
  });

  it('shows empty output for empty input', () => {
    renderWithRouter(<MarkdownTable page={PAGE} />);
    expect(screen.getByRole('textbox', { name: /markdown table/i }).value).toBe('');
  });
});

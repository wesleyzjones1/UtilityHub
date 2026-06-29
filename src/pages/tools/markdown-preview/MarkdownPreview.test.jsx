import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import MarkdownPreview from './MarkdownPreview';

const PAGE = {
  id: 'markdown-preview', title: 'Markdown Preview',
  description: 'Format and preview Markdown.', category: 'text',
  path: '/tools/markdown-preview',
};

describe('MarkdownPreview', () => {
  it('renders title', () => {
    renderWithRouter(<MarkdownPreview page={PAGE} />);
    expect(screen.getAllByText('Markdown Preview').length).toBeGreaterThan(0);
  });

  it('renders the preview panel by default', () => {
    renderWithRouter(<MarkdownPreview page={PAGE} />);
    expect(screen.getByLabelText(/html preview/i)).toBeDefined();
  });

  it('renders markdown as HTML', () => {
    renderWithRouter(<MarkdownPreview page={PAGE} />);
    const input = screen.getByRole('textbox', { name: /markdown input/i });
    fireEvent.change(input, { target: { value: '# Hello' } });
    const preview = screen.getByLabelText(/html preview/i);
    expect(preview.innerHTML).toContain('<h1>');
  });

  it('switches to format mode', async () => {
    renderWithRouter(<MarkdownPreview page={PAGE} />);
    const select = screen.getByRole('combobox', { name: /right panel/i });
    await userEvent.selectOptions(select, 'format');
    expect(screen.getByRole('textbox', { name: /formatted markdown/i })).toBeDefined();
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import TextDiff from './TextDiff';

const PAGE = {
  id: 'text-diff',
  title: 'Text Diff Viewer',
  description: 'Compare two text blocks and highlight the differences.',
  category: 'text',
  path: '/tools/text-diff',
};

describe('TextDiff', () => {
  it('renders the title', () => {
    renderWithRouter(<TextDiff page={PAGE} />);
    expect(screen.getAllByText('Text Diff Viewer').length).toBeGreaterThan(0);
  });

  it('shows 0 additions and 0 deletions with empty inputs', () => {
    renderWithRouter(<TextDiff page={PAGE} />);
    expect(screen.getByText(/0 additions/)).toBeDefined();
    expect(screen.getByText(/0 deletions/)).toBeDefined();
  });

  it('shows 1 removal and 1 addition when original is "hello" and modified is "world"', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TextDiff page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /original text/i }), 'hello');
    await user.type(screen.getByRole('textbox', { name: /modified text/i }), 'world');
    expect(screen.getByText(/1 addition/)).toBeDefined();
    expect(screen.getByText(/1 deletion/)).toBeDefined();
  });

  it('shows 0 additions and 0 deletions when both inputs are identical', async () => {
    const user = userEvent.setup();
    renderWithRouter(<TextDiff page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /original text/i }), 'same text');
    await user.type(screen.getByRole('textbox', { name: /modified text/i }), 'same text');
    expect(screen.getByText(/0 additions/)).toBeDefined();
    expect(screen.getByText(/0 deletions/)).toBeDefined();
  });
});

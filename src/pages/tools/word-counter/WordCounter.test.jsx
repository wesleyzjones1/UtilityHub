import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import WordCounter from './WordCounter';

const PAGE = {
  id: 'word-counter', title: 'Word Counter',
  description: 'Count words and characters.', category: 'text',
  path: '/tools/word-counter',
};

describe('WordCounter', () => {
  it('renders title', () => {
    renderWithRouter(<WordCounter page={PAGE} />);
    expect(screen.getAllByText('Word Counter').length).toBeGreaterThan(0);
  });

  it('shows zero stats for empty input', () => {
    renderWithRouter(<WordCounter page={PAGE} />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThan(0);
  });

  it('shows correct word count', async () => {
    const user = userEvent.setup();
    renderWithRouter(<WordCounter page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /text to count/i }), 'hello world foo');
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
  });

  it('shows correct character count', async () => {
    const user = userEvent.setup();
    renderWithRouter(<WordCounter page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /text to count/i }), 'abc');
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
  });

  it('renders all stat labels', () => {
    renderWithRouter(<WordCounter page={PAGE} />);
    expect(screen.getByText('Words')).toBeDefined();
    expect(screen.getByText('Characters')).toBeDefined();
    expect(screen.getByText('Lines')).toBeDefined();
    expect(screen.getByText('Reading time')).toBeDefined();
  });
});

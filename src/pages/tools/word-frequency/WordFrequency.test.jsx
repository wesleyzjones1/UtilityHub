import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test-utils';
import WordFrequency from './WordFrequency';

const PAGE = {
  id: 'word-frequency', title: 'Word Frequency Analyzer',
  description: 'Analyze word frequency.', category: 'text',
  path: '/tools/word-frequency',
};

describe('WordFrequency', () => {
  it('renders title', () => {
    renderWithRouter(<WordFrequency page={PAGE} />);
    expect(screen.getAllByText('Word Frequency Analyzer').length).toBeGreaterThan(0);
  });

  it('shows no table for empty input', () => {
    renderWithRouter(<WordFrequency page={PAGE} />);
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('shows frequency table when text is entered', async () => {
    const user = userEvent.setup();
    renderWithRouter(<WordFrequency page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /text to analyze/i }), 'apple apple banana');
    expect(screen.getByRole('table')).toBeDefined();
    expect(screen.getByText('apple')).toBeDefined();
    expect(screen.getByText('banana')).toBeDefined();
  });

  it('shows count of 2 for a repeated word', async () => {
    const user = userEvent.setup();
    renderWithRouter(<WordFrequency page={PAGE} />);
    await user.type(screen.getByRole('textbox', { name: /text to analyze/i }), 'apple apple');
    expect(screen.getByText('2')).toBeDefined();
  });

  it('renders toggles for stop words and case sensitivity', () => {
    renderWithRouter(<WordFrequency page={PAGE} />);
    const toggles = screen.getAllByRole('switch');
    expect(toggles.length).toBe(2);
  });

  it('excludes stop words when toggled', async () => {
    const user = userEvent.setup();
    renderWithRouter(<WordFrequency page={PAGE} />);
    await user.type(
      screen.getByRole('textbox', { name: /text to analyze/i }),
      'the cat and the dog'
    );
    const [stopWordToggle] = screen.getAllByRole('switch');
    await user.click(stopWordToggle);
    expect(screen.queryByText('the')).toBeNull();
  });
});

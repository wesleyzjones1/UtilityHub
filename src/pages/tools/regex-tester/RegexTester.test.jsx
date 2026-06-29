import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '../../../test-utils';
import RegexTester from './RegexTester';

const PAGE = {
  id: 'regex-tester',
  title: 'Regex Tester',
  description: 'Test and debug regular expressions interactively with live match highlighting.',
  category: 'web',
  path: '/tools/regex-tester',
};

describe('RegexTester', () => {
  it('renders the title', () => {
    renderWithRouter(<RegexTester page={PAGE} />);
    expect(screen.getAllByText('Regex Tester').length).toBeGreaterThan(0);
  });

  it('shows the test string textarea with default content', () => {
    renderWithRouter(<RegexTester page={PAGE} />);
    const textarea = screen.getByRole('textbox', { name: /test string/i });
    expect(textarea).toBeTruthy();
    expect(textarea.value).toContain('quick brown fox');
  });

  it('shows match count when pattern matches default test string', () => {
    renderWithRouter(<RegexTester page={PAGE} />);
    const patternInput = screen.getByRole('textbox', { name: /pattern/i });
    fireEvent.change(patternInput, { target: { value: 'the' } });
    const matchTexts = screen.getAllByText(/match/i);
    expect(matchTexts.length).toBeGreaterThan(0);
  });

  it('shows error message for invalid pattern', () => {
    renderWithRouter(<RegexTester page={PAGE} />);
    const patternInput = screen.getByRole('textbox', { name: /pattern/i });
    fireEvent.change(patternInput, { target: { value: '[' } });
    const invalidTexts = screen.getAllByText(/invalid/i);
    expect(invalidTexts.length).toBeGreaterThan(0);
  });
});

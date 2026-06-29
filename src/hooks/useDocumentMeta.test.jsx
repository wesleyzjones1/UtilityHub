import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { useDocumentMeta } from './useDocumentMeta';

function Meta(props) {
  useDocumentMeta(props);
  return null;
}

function descContent() {
  return document.head.querySelector('meta[name="description"]')?.getAttribute('content');
}

describe('useDocumentMeta', () => {
  it('sets a tool-specific title and description', () => {
    render(<Meta title="Word Counter" description="Count words and characters." />);
    expect(document.title).toBe('Word Counter — UtilityHub');
    expect(descContent()).toBe('Count words and characters.');
  });

  it('falls back to site defaults when no title is given', () => {
    render(<Meta />);
    expect(document.title).toBe('UtilityHub — free online tools');
    expect(descContent()).toMatch(/free online tools/i);
  });

  it('keeps Open Graph tags in sync with the title', () => {
    render(<Meta title="Regex Tester" description="Test regular expressions." />);
    const ogTitle = document.head.querySelector('meta[property="og:title"]')?.getAttribute('content');
    expect(ogTitle).toBe('Regex Tester — UtilityHub');
  });

  it('maintains a single canonical link', () => {
    render(<Meta title="A" />);
    render(<Meta title="B" />);
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PageShell from './PageShell';

const mockPage = {
  id: 'case-converter',
  title: 'Case Converter',
  description: 'Convert text between cases.',
  category: 'text',
  path: '/tools/case-converter',
  keywords: [],
};

function renderShell(props = {}) {
  return render(
    <MemoryRouter>
      <PageShell page={mockPage} {...props}>
        <div>Tool UI here</div>
      </PageShell>
    </MemoryRouter>
  );
}

describe('PageShell', () => {
  it('renders page title as h1', () => {
    renderShell();
    expect(screen.getByRole('heading', { level: 1, name: 'Case Converter' })).toBeInTheDocument();
  });

  it('renders page description', () => {
    renderShell();
    expect(screen.getByText('Convert text between cases.')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    renderShell();
    // label appears in both breadcrumb and badge — use getAllByText
    const matches = screen.getAllByText('Text Tools');
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it('renders breadcrumb with Home link', () => {
    renderShell();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });

  it('renders breadcrumb with current page name as aria-current', () => {
    renderShell();
    const current = screen.getAllByText('Case Converter').find(el => el.getAttribute('aria-current') === 'page');
    expect(current).toBeInTheDocument();
  });

  it('renders children slot', () => {
    renderShell();
    expect(screen.getByText('Tool UI here')).toBeInTheDocument();
  });

  it('renders how-to-use section with steps', () => {
    renderShell({ howToUse: ['Paste text', 'Select case', 'Copy result'] });
    expect(screen.getByRole('heading', { level: 2, name: 'How to use' })).toBeInTheDocument();
    expect(screen.getByText('Paste text')).toBeInTheDocument();
    expect(screen.getByText('Select case')).toBeInTheDocument();
    expect(screen.getByText('Copy result')).toBeInTheDocument();
  });

  it('does not render how-to-use section when steps are empty', () => {
    renderShell({ howToUse: [] });
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });
});

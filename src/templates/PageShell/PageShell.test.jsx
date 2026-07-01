import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../test-utils';
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
  return renderWithRouter(
    <PageShell page={mockPage} {...props}>
      <div>Tool UI here</div>
    </PageShell>
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

  it('does not show the category badge or breadcrumb', () => {
    renderShell();
    expect(screen.queryByText('Text Tools')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Breadcrumb' })).not.toBeInTheDocument();
  });

  it('renders children slot', () => {
    renderShell();
    expect(screen.getByText('Tool UI here')).toBeInTheDocument();
  });

  it('renders related tools suggestions', () => {
    renderShell();
    expect(screen.getByRole('heading', { level: 2, name: 'Related tools' })).toBeInTheDocument();
  });
});

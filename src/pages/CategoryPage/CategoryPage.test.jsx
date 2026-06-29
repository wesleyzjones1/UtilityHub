import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import CategoryPage from './CategoryPage';
import { CATEGORIES, PAGE_BY_CATEGORY } from '../../registry/pages';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';
import { AdPreferenceProvider } from '../../context/AdPreferenceContext';
import { FavoritesProvider } from '../../context/FavoritesContext';
import { SupportProvider } from '../../context/SupportContext';
import { render } from '@testing-library/react';

function renderCategory(categoryId) {
  return render(
    <MemoryRouter initialEntries={[`/tools/category/${categoryId}`]}>
      <ThemeProvider>
        <LanguageProvider>
          <AdPreferenceProvider>
            <FavoritesProvider>
              <SupportProvider>
                <Routes>
                  <Route path="/tools/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/" element={<div>home</div>} />
                </Routes>
              </SupportProvider>
            </FavoritesProvider>
          </AdPreferenceProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('CategoryPage', () => {
  it('renders the category title', () => {
    renderCategory('text');
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getAllByText('Text Tools').length).toBeGreaterThan(0);
  });

  it('lists all tools in the category', () => {
    renderCategory('text');
    const pages = PAGE_BY_CATEGORY['text'];
    for (const page of pages) {
      expect(screen.getByText(page.title)).toBeDefined();
    }
  });

  it('shows the tool count', () => {
    renderCategory('image');
    const pages = PAGE_BY_CATEGORY['image'];
    expect(screen.getByText(new RegExp(`${pages.length} tool`))).toBeDefined();
  });

  it('each tool is a link to the tool path', () => {
    renderCategory('web');
    const pages = PAGE_BY_CATEGORY['web'];
    const links = screen.getAllByRole('link');
    const hrefs = links.map(l => l.getAttribute('href'));
    for (const page of pages.slice(0, 3)) {
      expect(hrefs).toContain(page.path);
    }
  });

  it('redirects to home for unknown category', () => {
    renderCategory('nonexistent');
    expect(screen.getByText('home')).toBeDefined();
  });

  it('renders the category description', () => {
    renderCategory('color');
    const cat = CATEGORIES['color'];
    expect(screen.getByText(new RegExp(cat.description.slice(0, 20)))).toBeDefined();
  });
});

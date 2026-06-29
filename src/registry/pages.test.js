import { describe, it, expect } from 'vitest';
import {
  PAGES,
  CATEGORIES,
  PAGE_BY_CATEGORY,
  PAGE_BY_ID,
  searchPages,
} from './pages';

describe('Registry: PAGES', () => {
  it('has entries', () => {
    expect(PAGES.length).toBeGreaterThan(0);
  });

  it('every page has required fields', () => {
    for (const p of PAGES) {
      expect(p.id, `${p.id} missing id`).toBeTruthy();
      expect(p.title, `${p.id} missing title`).toBeTruthy();
      expect(p.description, `${p.id} missing description`).toBeTruthy();
      expect(p.category, `${p.id} missing category`).toBeTruthy();
      expect(p.path, `${p.id} missing path`).toBeTruthy();
      expect(Array.isArray(p.keywords), `${p.id} keywords must be array`).toBe(true);
    }
  });

  it('all page ids are unique', () => {
    const ids = PAGES.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all page paths are unique', () => {
    const paths = PAGES.map(p => p.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('every page category exists in CATEGORIES', () => {
    for (const p of PAGES) {
      expect(CATEGORIES[p.category], `Unknown category "${p.category}" in page "${p.id}"`).toBeDefined();
    }
  });
});

describe('Registry: PAGE_BY_CATEGORY', () => {
  it('contains every category', () => {
    for (const catId of Object.keys(CATEGORIES)) {
      expect(PAGE_BY_CATEGORY[catId]).toBeDefined();
    }
  });

  it('pages within each category are sorted alphabetically by title', () => {
    for (const [catId, pages] of Object.entries(PAGE_BY_CATEGORY)) {
      for (let i = 1; i < pages.length; i++) {
        expect(
          pages[i - 1].title.localeCompare(pages[i].title),
          `Out-of-order in category "${catId}": "${pages[i - 1].title}" should come before "${pages[i].title}"`
        ).toBeLessThanOrEqual(0);
      }
    }
  });

  it('all pages across categories total matches PAGES', () => {
    const total = Object.values(PAGE_BY_CATEGORY).reduce((s, arr) => s + arr.length, 0);
    expect(total).toBe(PAGES.length);
  });
});

describe('Registry: PAGE_BY_ID', () => {
  it('looks up pages by id', () => {
    for (const p of PAGES) {
      expect(PAGE_BY_ID[p.id]).toBe(p);
    }
  });
});

describe('searchPages()', () => {
  it('returns empty array for empty query', () => {
    expect(searchPages('')).toEqual([]);
    expect(searchPages('   ')).toEqual([]);
    expect(searchPages(null)).toEqual([]);
    expect(searchPages(undefined)).toEqual([]);
  });

  it('matches by title', () => {
    const results = searchPages('json');
    expect(results.some(r => r.id === 'json-formatter')).toBe(true);
  });

  it('matches by description', () => {
    const results = searchPages('placeholder lorem ipsum text');
    expect(results.some(r => r.id === 'lorem-ipsum')).toBe(true);
  });

  it('matches by keyword', () => {
    const results = searchPages('uuid');
    expect(results.some(r => r.id === 'uuid-generator')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(searchPages('JSON').some(r => r.id === 'json-formatter')).toBe(true);
    expect(searchPages('Json').some(r => r.id === 'json-formatter')).toBe(true);
  });

  it('returns at most 8 results', () => {
    const results = searchPages('a'); // broad query
    expect(results.length).toBeLessThanOrEqual(8);
  });

  it('prioritizes title matches over description/keyword matches', () => {
    const results = searchPages('converter');
    const firstResult = results[0];
    expect(firstResult.title.toLowerCase()).toContain('converter');
  });

  it('returns empty for no match', () => {
    expect(searchPages('xyzzy_no_match_ever')).toEqual([]);
  });
});

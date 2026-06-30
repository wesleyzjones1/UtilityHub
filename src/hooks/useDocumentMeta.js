import { useEffect } from 'react';

const SITE_NAME = 'UtilityHub';
const DEFAULT_DESCRIPTION =
  'Free online tools for text, math, colors, images, web development, and time. No sign-up required.';

function upsertMeta(keyName, key, content) {
  let el = document.head.querySelector(`meta[${keyName}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(keyName, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Keeps the document <title>, meta description, canonical link, and Open Graph /
 * Twitter tags in sync as the user navigates. Improves browser tab clarity,
 * bookmarks, history, and link previews. (Note: with hash routing, JS-rendered
 * tags help share/bookmark UX but not deep crawler indexing — the static tags in
 * index.html cover the site root, which is what most scrapers fetch.)
 */
export function useDocumentMeta({ title, description, enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — free online tools`;
    const desc = description || DEFAULT_DESCRIPTION;

    document.title = fullTitle;
    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', window.location.href);
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertCanonical(window.location.href);
  }, [title, description, enabled]);
}

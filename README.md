# UtilityHub
UtilityHub is a clean, easy-to-use collection of web tools for text, data, engineering, and image tasks. It helps users get quick results with simple utilities in one organized place.

## Live demo

Once GitHub Pages is enabled (see **Deploying** below), the site is published at:

```
https://wesleyzjones1.github.io/UtilityHub/
```

## Local development

```bash
npm install      # install dependencies
npm run dev      # start the Vite dev server (http://localhost:5173)
npm test         # run the test suite
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

The app is a fully client-side React + Vite single-page app — there is no backend, and every
tool runs entirely in the browser.

## Deploying (GitHub Pages)

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`):

1. In the repository, go to **Settings → Pages** and set **Source: GitHub Actions** (one-time).
2. Push or merge to the **`main`** branch — the workflow builds the site and publishes it.
   You can also trigger it manually from the **Actions** tab ("Deploy to GitHub Pages" →
   *Run workflow*).

Routing uses a hash router (`/#/tools/...`) and Vite is configured with a relative `base`, so the
build works from any Pages subpath and deep links survive a refresh without extra redirect config.

# TODO list


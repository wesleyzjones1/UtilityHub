import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const plugins = [react()];

// Only enable the PWA/service-worker plugin for real builds/dev — keep it out of
// the Vitest run so tests never need to resolve the `virtual:pwa-register` module.
if (!process.env.VITEST) {
  plugins.push(
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // we call registerSW() ourselves in src/registerPWA.js
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'UtilityHub — free online tools',
        short_name: 'UtilityHub',
        description: 'Free online tools for text, math, colors, images, web development, and time — all in your browser.',
        theme_color: '#6366f1',
        background_color: '#0b0f17',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: 'index.html',
        // Tools can produce large outputs; keep the precache lean and runtime-cache the rest.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      devOptions: { enabled: false },
    })
  );
}

export default defineConfig({
  // Relative base so the build works from any GitHub Pages subpath
  // (e.g. https://<user>.github.io/<repo>/) without hardcoding the repo name.
  base: './',
  plugins,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
    css: true,
    exclude: ['**/node_modules/**', '**/.claude/worktrees/**'],
  },
});

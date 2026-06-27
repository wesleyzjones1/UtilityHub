import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base so the build works from any GitHub Pages subpath
  // (e.g. https://<user>.github.io/<repo>/) without hardcoding the repo name.
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
    css: true,
    exclude: ['**/node_modules/**', '**/.claude/worktrees/**'],
  },
});

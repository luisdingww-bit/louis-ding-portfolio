import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal declaration so tsc accepts `process.env` in this config file.
// At runtime, Node provides `process` natively.
declare const process: { env: Record<string, string | undefined> };

// When building for GitHub Pages (project site), assets must be served from
// /louis-ding-portfolio/. Set PAGES=true in the CI build step to switch base.
// Surge builds keep the default '/' base.
const pagesBase = process.env.PAGES === 'true' ? '/louis-ding-portfolio/' : '/';

export default defineConfig({
  base: pagesBase,
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});

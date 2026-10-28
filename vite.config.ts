import { defineConfig } from 'vite';

// Relative base so the build works under a GitHub Pages project path.
export default defineConfig({
  base: './',
  server: { proxy: { '/tiles': { target: 'https://voltnav.app', changeOrigin: true, rewrite: (p) => p.replace(/^\/tiles/, '/api/tiles') } } },
  build: { rollupOptions: { input: { main: 'index.html', sources: 'sources.html' } } },
  test: { include: ['src/**/*.test.ts'] },
});

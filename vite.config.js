import { defineConfig } from 'vite'

// base: './' keeps every asset URL relative, so the built dist/ works whether it is
// served from a domain root or a sub-path/sub-domain on the caner-demo nginx host.
export default defineConfig({
  base: './',
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true
  }
})

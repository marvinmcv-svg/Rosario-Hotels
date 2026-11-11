import { defineConfig } from 'vite';

// three.js lives in its own lazy-loaded chunk (hero only), so its size is expected
export default defineConfig({ build: { chunkSizeWarningLimit: 700 } });

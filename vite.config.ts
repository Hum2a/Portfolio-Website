import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';
import path from 'node:path';

function isPathSegment(id: string, name: string): boolean {
  return (
    id.includes(`/node_modules/${name}/`) ||
    id.includes(`\\node_modules\\${name}\\`)
  );
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithm: 'brotliCompress' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        // Claim react/react-dom first so framer-motion / recharts do not absorb
        // them (that forced the homepage to download the recharts chunk).
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (isPathSegment(id, 'firebase')) return 'firebase';

          if (
            isPathSegment(id, 'react-dom') ||
            isPathSegment(id, 'scheduler') ||
            isPathSegment(id, 'react') ||
            isPathSegment(id, 'react-is')
          ) {
            return 'react-vendor';
          }

          if (isPathSegment(id, 'framer-motion')) return 'framer-motion';

          // Keep utility packages out of the recharts chunk so the homepage
          // (cn/cva) does not statically import recharts.
          if (
            isPathSegment(id, 'clsx') ||
            isPathSegment(id, 'class-variance-authority') ||
            isPathSegment(id, 'tailwind-merge')
          ) {
            return 'react-vendor';
          }

          if (isPathSegment(id, 'recharts') || isPathSegment(id, 'victory-vendor')) {
            return 'recharts';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from 'path';
import { vitePlugin as remix } from "@remix-run/dev";


export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
  ],
  publicDir: 'public',
  build: {
    manifest: true,
    rollupOptions: {
      // Ensure proper resolution of commonjs modules
      onwarn: (warning, warn) => {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      }
    }
  },
  resolve: {
    alias: {
      '~': '/app',
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});

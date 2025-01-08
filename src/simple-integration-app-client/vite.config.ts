import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from 'path';
import { vitePlugin as remix } from "@remix-run/dev";


export default defineConfig({
  plugins: [
    tsconfigPaths(),
    remix(),
  ],
  resolve: {
    alias: {
      '~': '/app',
    },
  },
  server: {
    port: 3000,
  }
});

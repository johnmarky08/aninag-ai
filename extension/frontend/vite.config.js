import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5173,
    strictPort: false,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
    outDir: "../dist",
  },
 
});

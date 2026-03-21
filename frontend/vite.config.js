import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    outDir: "../extension/dist",
    emptyOutDir: true,
    lib: {
      entry: "src/main.js",
      formats: ["es"],
      fileName: () => "assets/index.js",
      cssFileName: "index",
    },
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});

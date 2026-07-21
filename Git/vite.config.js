import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  // GitHub Pages serves this project at /ASN/, while local development uses /.
  base: process.env.GITHUB_ACTIONS ? "/ASN/" : "/",
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,
    strictPort: true,
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

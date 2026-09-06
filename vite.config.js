import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": rootDirectory,
      },
    },
    build: {
      chunkSizeWarningLimit: 1e3,
      // Increase limit to 1000kb (suppress the 500kb warning)
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: ["localhost", "127.0.0.1", "devjournal-hq11.onrender.com"],
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
      allowedHosts: ["localhost", "127.0.0.1", "devjournal-hq11.onrender.com"],
    },
  };
});

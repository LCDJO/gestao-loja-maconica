import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const plugins = [react(), tailwindcss(), vitePluginManusRuntime()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../../packages/shared"),
    },
  },
  envDir: path.resolve(__dirname, "../../"),
  server: {
    port: 3001,
    strictPort: true,
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../../dist/public"),
    emptyOutDir: true,
  },
});

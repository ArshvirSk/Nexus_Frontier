import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      disable: false,
      registerType: "autoUpdate",
      manifest: {
        name: "Aptos Fullstack Template",
        short_name: "Aptos Template",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
    },
  },
  server: {
    proxy: {
      "^/api/v1/.*": {
        target: "https://api.testnet.aptoslabs.com/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ""),
        secure: false,
      },
    },
  },
  define: {
    global: "globalThis",
    "process.env": {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      target: "esnext",
    },
    include: ["buffer"],
  },
});

// Only define Buffer globally if it's in a browser environment
if (typeof window !== "undefined") {
  (window as any).Buffer = Buffer;
}

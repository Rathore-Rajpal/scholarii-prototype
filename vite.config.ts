// TanStack Start config for Vercel deployment
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Cloudflare outputs dist/server/index.js; TanStack SPA prerender expects server.js.
  cloudflare: false,
  tanstackStart: {
    server: { entry: "server" },
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
      },
    },
  },
});

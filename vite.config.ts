/// <reference types="vitest" />
import path from "path";
import tailwindcss from "@tailwindcss/vite"; //linea nueva

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

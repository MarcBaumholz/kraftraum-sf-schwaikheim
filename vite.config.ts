import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const repositoryName = "kraftraum-sf-schwaikheim";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? `/${repositoryName}/` : "/",
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: true
  }
});

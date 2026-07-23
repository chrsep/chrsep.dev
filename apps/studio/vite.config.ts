import { defineConfig } from "vite-plus"

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: "./node_modules/.bin/sanity build ./dist -y",
        cache: true,
        env: ["SANITY_STUDIO_*"],
        input: [
          "package.json",
          "sanity.cli.ts",
          "sanity.config.ts",
          "schemas/**",
          "static/**",
          "tsconfig.json",
          "vite.config.ts",
          { pattern: "package.json", base: "workspace" },
          { pattern: "pnpm-lock.yaml", base: "workspace" },
          { pattern: "vite.config.ts", base: "workspace" },
        ],
        output: ["dist/**"],
      },
    },
  },
})

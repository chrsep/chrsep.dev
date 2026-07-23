import { sveltekit } from "@sveltejs/kit/vite"
import { imagetools } from "vite-imagetools"
import svg from "@poppanator/sveltekit-svg"
import tailwindcss from "@tailwindcss/vite"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { defineConfig, lazyPlugins } from "vite-plus"

import { paraglideOptions } from "./paraglide.config.js"

export default defineConfig({
  plugins: lazyPlugins(() => [
    tailwindcss(),
    sveltekit(),
    svg(),
    imagetools(),
    paraglideVitePlugin(paraglideOptions),
  ]),
  run: {
    tasks: {
      build: {
        // Vite+ 0.2 caches files but not pnpm symlinks in Vercel functions.
        command: "node ../../scripts/restore-vercel-symlinks.mjs",
        dependsOn: ["build:cached"],
        cache: false,
      },
      "build:cached": {
        command: "node ../../scripts/run-stable-build.mjs vp build",
        dependsOn: ["sync:studio"],
        cache: true,
        input: [
          "package.json",
          "paraglide.config.js",
          "project.inlang/**",
          "messages/**",
          "src/**",
          "!src/lib/paraglide/**",
          "static/**",
          "svelte.config.js",
          "tsconfig.json",
          "vite.config.ts",
          { pattern: "package.json", base: "workspace" },
          { pattern: "pnpm-lock.yaml", base: "workspace" },
          {
            pattern: "scripts/run-stable-build.mjs",
            base: "workspace",
          },
          { pattern: "vite.config.ts", base: "workspace" },
        ],
        output: [
          ".svelte-kit/output/**",
          ".svelte-kit/vite-plus-vercel-symlinks.json",
          ".vercel/output/**",
        ],
      },
      "sync:studio": {
        command: "node ./scripts/sync-studio.mjs",
        dependsOn: ["studio#build"],
        cache: true,
        input: [
          "scripts/sync-studio.mjs",
          { pattern: "apps/studio/dist/**", base: "workspace" },
        ],
        output: ["static/studio/**"],
      },
    },
  },
})

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
        command: "vp build",
        dependsOn: ["sync:studio"],
        cache: false,
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

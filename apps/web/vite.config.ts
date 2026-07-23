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
        command:
          "rm -rf ./static/studio && mkdir ./static/studio && cp -R ../studio/dist/. ./static/studio && vp build",
        dependsOn: ["studio#build"],
        cache: false,
      },
    },
  },
})

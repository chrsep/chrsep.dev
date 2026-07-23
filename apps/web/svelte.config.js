import { mdsvex } from "mdsvex"
import mdsvexConfig from "./mdsvex.config.js"
import vercel from "@sveltejs/adapter-vercel"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import("@sveltejs/kit").Config} */
const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],
  preprocess: [vitePreprocess({ script: true }), mdsvex(mdsvexConfig)],
  kit: {
    adapter: vercel(),
    alias: {
      $icons: "src/icons",
      $images: "src/images",
    },
  },
}

export default config

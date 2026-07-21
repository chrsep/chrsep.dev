import { mdsvex } from "mdsvex"
import mdsvexConfig from "./mdsvex.config.js"
import { sveltePreprocess } from "svelte-preprocess"
import vercel from "@sveltejs/adapter-vercel"

/** @type {import("@sveltejs/kit").Config} */
const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],
  preprocess: [sveltePreprocess(), mdsvex(mdsvexConfig)],
  kit: {
    adapter: vercel(),
    alias: {
      $icons: "src/icons",
      $images: "src/images",
    },
    prerender: {
      // Localized alias of the agent-sessions redirect; nothing links to it,
      // so the crawler can't discover it on its own.
      entries: ["*", "/id/resources/vibecoding-demo/agent-sessions"],
    },
  },
}

export default config

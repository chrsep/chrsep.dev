import { mdsvex } from "mdsvex"
import mdsvexConfig from "./mdsvex.config.js"
import preprocess from "svelte-preprocess"
import vercel from "@sveltejs/adapter-vercel"
import windiCSS from "vite-plugin-windicss"
import { imagetools } from "vite-imagetools"
import path from "path"
import svg from "@poppanator/sveltekit-svg"

/** @type {import("@sveltejs/kit").Config} */
const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess(), mdsvex(mdsvexConfig)],

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    adapter: vercel(),
    vite: {
      plugins: [svg(), windiCSS(), imagetools()],
      resolve: {
        alias: {
          $icons: path.resolve("./src/icons"),
        },
      },
    },
  },
}

export default config

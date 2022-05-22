import { mdsvex } from "mdsvex"
import mdsvexConfig from "./mdsvex.config.js"
import preprocess from "svelte-preprocess"
import vercel from "@sveltejs/adapter-vercel"
import { imagetools } from "vite-imagetools"
import path from "path"
import svg from "@poppanator/sveltekit-svg"

/** @type {import("@sveltejs/kit").Config} */
const config = {
  extensions: [".svelte", ...mdsvexConfig.extensions],

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
    }),
    mdsvex(mdsvexConfig),
  ],

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    adapter: vercel({
      edge: true,
      split: true,
    }),
    vite: {
      plugins: [svg(), imagetools()],
      resolve: {
        alias: {
          $icons: path.resolve("./src/icons"),
          $images: path.resolve("./src/images"),
        },
      },
    },
  },
}

export default config

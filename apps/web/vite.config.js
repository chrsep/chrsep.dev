import { sveltekit } from "@sveltejs/kit/vite"
import { imagetools } from "vite-imagetools"
import svg from "@poppanator/sveltekit-svg"
import tailwindcss from "@tailwindcss/vite"
import { paraglideVitePlugin } from "@inlang/paraglide-js"

export default {
  plugins: [
    tailwindcss(),
    sveltekit(),
    svg(),
    imagetools(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      strategy: ["url", "baseLocale"],
    }),
  ],
}

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
      routeStrategies: [
        { match: "/sitemap.xml", exclude: true },
        { match: "/robots.txt", exclude: true },
        { match: "/studio", exclude: true },
        { match: "/studio/:path(.*)?", exclude: true },
        { match: "/resources/vibecoding-workshop.pdf", exclude: true },
        {
          match: "/resources/vibecoding-demo/agent-sessions",
          exclude: true,
        },
        {
          match: "/resources/vibecoding-demo/agent-sessions/:path(.*)?",
          exclude: true,
        },
      ],
    }),
  ],
}

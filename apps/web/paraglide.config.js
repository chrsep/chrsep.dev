/** @type {import("@inlang/paraglide-js").ParaglideVitePluginOptions} */
export const paraglideOptions = {
  project: "./project.inlang",
  outdir: "./src/lib/paraglide",
  emitPrettierIgnore: false,
  isServer: "import.meta.env?.SSR ?? typeof window === 'undefined'",
  outputStructure: "message-modules",
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
}

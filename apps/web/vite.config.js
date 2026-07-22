import { sveltekit } from "@sveltejs/kit/vite"
import { fileURLToPath } from "node:url"
import { defineConfig, loadEnv } from "vite"
import { imagetools } from "vite-imagetools"
import svg from "@poppanator/sveltekit-svg"
import tailwindcss from "@tailwindcss/vite"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import posthogRollupPlugin from "@posthog/rollup-plugin"
import { LOCALIZATION_EXCLUSIONS } from "./src/lib/routes.js"

// A subtree route contributes both its exact match and a wildcard descendant
// match; an exact route contributes only itself. Derived from the shared
// exclusion list so paraglide, the request hooks and vercel.json stay aligned.
// The annotation pins `exclude` to the literal `true` RouteStrategy requires
// (a bare object literal would widen it to `boolean`).
/** @type {NonNullable<import("@inlang/paraglide-js").CompilerOptions["routeStrategies"]>} */
const localizationExcludedRouteStrategies = LOCALIZATION_EXCLUSIONS.flatMap(
  (route) =>
    route.subtree
      ? [
          { match: route.path, exclude: true },
          { match: `${route.path}/:path(.*)?`, exclude: true },
        ]
      : [{ match: route.path, exclude: true }],
)

const webRoot = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, webRoot, "")
  /** @param {string} name */
  const readEnv = (name) => process.env[name] ?? fileEnv[name]
  const deploymentId = readEnv("VERCEL_DEPLOYMENT_ID")
  const release =
    readEnv("VERCEL_GIT_COMMIT_SHA") ?? deploymentId ?? "local-development"
  const environment =
    readEnv("VERCEL_ENV") ??
    readEnv("PUBLIC_POSTHOG_ENVIRONMENT") ??
    process.env.NODE_ENV ??
    "development"
  const posthogApiKey = readEnv("POSTHOG_API_KEY") ?? ""
  const posthogProjectId = readEnv("POSTHOG_PROJECT_ID") ?? ""
  const posthogHost = readEnv("POSTHOG_HOST") ?? ""
  const sourceMapUploadEnabled = Boolean(
    posthogApiKey && posthogProjectId && posthogHost,
  )

  const posthogPlugins = sourceMapUploadEnabled
    ? [
        posthogRollupPlugin({
          personalApiKey: posthogApiKey,
          projectId: posthogProjectId,
          host: posthogHost,
          sourcemaps: {
            enabled: true,
            releaseName: "chrsep.dev-web",
            releaseVersion: release,
            build: deploymentId,
            deleteAfterUpload: true,
          },
        }),
      ]
    : []

  return {
    envDir: webRoot,
    envPrefix: ["VITE_", "PUBLIC_"],
    define: {
      __APP_ENVIRONMENT__: JSON.stringify(environment),
      __APP_RELEASE__: JSON.stringify(release),
    },
    build: {
      sourcemap: sourceMapUploadEnabled ? "hidden" : false,
    },
    plugins: [
      tailwindcss(),
      sveltekit(),
      svg(),
      imagetools(),
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/lib/paraglide",
        strategy: ["url", "baseLocale"],
        routeStrategies: localizationExcludedRouteStrategies,
      }),
      ...posthogPlugins,
    ],
  }
})

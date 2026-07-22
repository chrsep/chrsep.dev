/**
 * Single source of truth for the site's canonical routes.
 *
 * Plain ESM + JSDoc so it can be imported BOTH from TypeScript/Svelte code
 * (via `$lib/routes`) AND from a plain Node process (e.g. `scripts/seo-audit.mjs`
 * via a relative `../src/lib/routes.js` import). Keep it dependency-free.
 *
 * Each route carries every id it is known by so the three historically
 * hand-written classifications (SEO ids, PostHog analytics ids, pathnames) stay
 * in sync from one place.
 */

/** @typedef {"en" | "id"} Locale */

/**
 * Stable SEO route ids. Pages pass these to `<Seo routeId>` and `seo.ts` derives
 * its `SeoRouteId` type from them, so do NOT rename existing entries.
 */
export const SEO_ROUTE_IDS = /** @type {const} */ ([
  "home",
  "about",
  "cv",
  "vibe",
])

/** @typedef {(typeof SEO_ROUTE_IDS)[number]} SeoRouteId */

/** PostHog `route` property values. @typedef {"home" | "about" | "cv" | "vibecoding_demo"} AnalyticsRouteId */

/** @typedef {"home" | "profile" | "cv" | "workshop"} SeoSchemaKind */

/** @typedef {Readonly<Record<Locale, string>>} LocalizedValue */

/**
 * @typedef {Object} RouteDefinition
 * @property {SeoRouteId} seoId Stable SEO id shared with `<Seo routeId>`.
 * @property {AnalyticsRouteId} analyticsId PostHog `route` property value.
 * @property {LocalizedValue} paths Canonical localized pathnames (no trailing slash).
 * @property {string} socialImage
 * @property {LocalizedValue} socialImageAlt
 * @property {SeoSchemaKind} schemaKind
 */

/** Canonical production origin. The bare apex 308-redirects here. @type {"https://www.chrsep.dev"} */
export const SITE_ORIGIN = "https://www.chrsep.dev"

/**
 * Hostnames treated as first-party. Both the canonical `www` host and the bare
 * apex are internal: the apex redirects to `www` in production but can still
 * appear in analytics payloads (referrers, entry URLs), so redaction must treat
 * either as internal rather than leaking a URL as "external".
 * @type {readonly string[]}
 */
export const INTERNAL_HOSTNAMES = ["www.chrsep.dev", "chrsep.dev"]

/**
 * @typedef {Object} LocalizationExclusion
 * @property {string} path Canonical base pathname that opts out of locale prefixing.
 * @property {boolean} subtree Whether descendants under `${path}/` are excluded too.
 * @property {string} [robotsTag] X-Robots-Tag value vercel.json must serve for this
 *   route (its subtree when `subtree` is true). Omitted for routes that stay
 *   crawlable, e.g. sitemap.xml and robots.txt.
 */

/**
 * Single source of truth for non-localized routes. Consumed by the paraglide
 * `routeStrategies` (vite.config.js), `isLocalizationExcludedPath` below (re-exported
 * from url-normalization.ts for the request hooks) and the SEO audit's vercel.json
 * drift assertion, so those three representations can no longer drift apart.
 * @type {readonly LocalizationExclusion[]}
 */
export const LOCALIZATION_EXCLUSIONS = [
  { path: "/sitemap.xml", subtree: false },
  { path: "/robots.txt", subtree: false },
  { path: "/studio", subtree: true, robotsTag: "noindex, nofollow" },
  {
    path: "/resources/vibecoding-workshop.pdf",
    subtree: false,
    robotsTag: "noindex",
  },
  {
    path: "/resources/vibecoding-demo/agent-sessions",
    subtree: true,
    robotsTag: "noindex",
  },
]

/**
 * Whether a pathname opts out of locale handling (localization + SEO indexing).
 * Derived from `LOCALIZATION_EXCLUSIONS`; mirrors the historical predicate exactly.
 * @param {string} pathname
 * @returns {boolean}
 */
export function isLocalizationExcludedPath(pathname) {
  return LOCALIZATION_EXCLUSIONS.some(
    (route) =>
      pathname === route.path ||
      (route.subtree && pathname.startsWith(`${route.path}/`)),
  )
}

/** @type {readonly RouteDefinition[]} */
export const ROUTE_DEFINITIONS = [
  {
    seoId: "home",
    analyticsId: "home",
    paths: { en: "/", id: "/id" },
    socialImage: "/og/portfolio.png",
    socialImageAlt: {
      en: "Portfolio preview for Chrisando E. Pramudhita, full-stack software developer.",
      id: "Pratinjau portofolio Chrisando E. Pramudhita, full-stack software developer.",
    },
    schemaKind: "home",
  },
  {
    seoId: "about",
    analyticsId: "about",
    paths: { en: "/about", id: "/id/about" },
    socialImage: "/og/portfolio.png",
    socialImageAlt: {
      en: "Portfolio preview for Chrisando E. Pramudhita, full-stack software developer.",
      id: "Pratinjau portofolio Chrisando E. Pramudhita, full-stack software developer.",
    },
    schemaKind: "profile",
  },
  {
    seoId: "cv",
    analyticsId: "cv",
    paths: { en: "/cv", id: "/id/cv" },
    socialImage: "/og/portfolio.png",
    socialImageAlt: {
      en: "Portfolio preview for Chrisando E. Pramudhita, full-stack software developer.",
      id: "Pratinjau portofolio Chrisando E. Pramudhita, full-stack software developer.",
    },
    schemaKind: "cv",
  },
  {
    seoId: "vibe",
    analyticsId: "vibecoding_demo",
    paths: {
      en: "/resources/vibecoding-demo",
      id: "/id/resources/vibecoding-demo",
    },
    socialImage: "/og/vibecoding-workshop.png",
    socialImageAlt: {
      en: "Vibe Coding workshop resources by Chrisando E. Pramudhita.",
      id: "Materi workshop Vibe Coding oleh Chrisando E. Pramudhita.",
    },
    schemaKind: "workshop",
  },
]

/** @type {Map<string, RouteDefinition>} */
const routesByPathname = new Map()
for (const route of ROUTE_DEFINITIONS) {
  routesByPathname.set(route.paths.en, route)
  routesByPathname.set(route.paths.id, route)
}

/**
 * Drops any query/hash and a single trailing slash from a pathname.
 * @param {string} pathname
 * @returns {string}
 */
function normalizePathname(pathname) {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || "/"
  return withoutQuery !== "/" && withoutQuery.endsWith("/")
    ? withoutQuery.slice(0, -1)
    : withoutQuery
}

/**
 * Resolves the canonical route for a pathname in either locale. Tolerates an
 * appended query/hash and a trailing slash. Returns `undefined` for unknown
 * paths — callers own the "unknown" fallback.
 * @param {string} pathname
 * @returns {RouteDefinition | undefined}
 */
export function matchRoute(pathname) {
  return routesByPathname.get(normalizePathname(pathname))
}

/**
 * Analytics `route` id for a pathname, or `"unknown"` when unrecognized.
 * @param {string} pathname
 * @returns {AnalyticsRouteId | "unknown"}
 */
export function inferAnalyticsRoute(pathname) {
  return matchRoute(pathname)?.analyticsId ?? "unknown"
}

/**
 * Whether a hostname belongs to this site (canonical www host or bare apex).
 * @param {string} hostname
 * @returns {boolean}
 */
export function isInternalHostname(hostname) {
  return INTERNAL_HOSTNAMES.includes(hostname)
}

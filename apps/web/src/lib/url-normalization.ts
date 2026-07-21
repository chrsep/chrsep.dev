import { SEO_ROUTE_IDS, SEO_ROUTES, type Locale } from "$lib/seo"

const canonicalLocalizedRoutes = new Map<string, string>(
  SEO_ROUTE_IDS.map((routeId) => {
    const paths = SEO_ROUTES[routeId].paths

    return [paths.id, paths.en] as const
  }),
)

const isLocale = (segment: string): segment is Locale =>
  segment === "en" || segment === "id"

export function isLocalizationExcludedPath(pathname: string) {
  return (
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/studio" ||
    pathname.startsWith("/studio/") ||
    pathname === "/resources/vibecoding-workshop.pdf" ||
    pathname === "/resources/vibecoding-demo/agent-sessions" ||
    pathname.startsWith("/resources/vibecoding-demo/agent-sessions/")
  )
}

/**
 * Maps only real, canonical Indonesian page URLs to their unprefixed SvelteKit
 * route IDs. Aliases deliberately remain unresolved so the server can redirect
 * them instead of serving duplicate content.
 */
export function rerouteLocalizedPath(pathname: string) {
  return canonicalLocalizedRoutes.get(pathname)
}

/**
 * Returns a canonical redirect target for invalid leading locale aliases.
 * English is unprefixed, Indonesian uses `/id`, and the final locale in a run
 * of leading locale segments determines the destination.
 */
export function getLocaleAliasRedirect(url: URL) {
  const segments = url.pathname.split("/").filter(Boolean)
  let localeSegmentCount = 0
  let locale: Locale | undefined

  while (true) {
    const segment = segments[localeSegmentCount]

    if (!segment || !isLocale(segment)) {
      break
    }

    locale = segment
    localeSegmentCount += 1
  }

  if (!locale || (locale === "id" && localeSegmentCount === 1)) {
    return undefined
  }

  const unlocalizedPath = `/${segments.slice(localeSegmentCount).join("/")}`

  if (isLocalizationExcludedPath(unlocalizedPath)) {
    return undefined
  }

  const pathname =
    locale === "id"
      ? unlocalizedPath === "/"
        ? "/id"
        : `/id${unlocalizedPath}`
      : unlocalizedPath

  return `${pathname}${url.search}`
}

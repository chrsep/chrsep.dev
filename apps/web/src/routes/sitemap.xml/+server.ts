import type { RequestHandler } from "./$types"
import { absoluteUrl, SEO_ROUTE_IDS, SEO_ROUTES, type Locale } from "$lib/seo"

export const prerender = true

const locales = ["en", "id"] as const satisfies readonly Locale[]

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function alternateLink(hreflang: string, href: string) {
  return `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`
}

export const GET: RequestHandler = () => {
  const urls = SEO_ROUTE_IDS.flatMap((routeId) => {
    const route = SEO_ROUTES[routeId]
    const englishUrl = absoluteUrl(route.paths.en)
    const indonesianUrl = absoluteUrl(route.paths.id)
    const alternates = [
      alternateLink("en", englishUrl),
      alternateLink("id", indonesianUrl),
      alternateLink("x-default", englishUrl),
    ].join("\n")

    return locales.map((locale) => {
      const canonicalUrl = absoluteUrl(route.paths[locale])

      return [
        "  <url>",
        `    <loc>${escapeXml(canonicalUrl)}</loc>`,
        alternates,
        "  </url>",
      ].join("\n")
    })
  })

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n")

  return new Response(sitemap, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  })
}

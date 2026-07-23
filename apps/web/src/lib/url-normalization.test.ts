import { describe, expect, it } from "vite-plus/test"
import {
  getLocaleAliasRedirect,
  isLocalizationExcludedPath,
  rerouteLocalizedPath,
} from "./url-normalization"

describe("localized route resolution", () => {
  it.each([
    ["/id", "/"],
    ["/id/about", "/about"],
    ["/id/cv", "/cv"],
    ["/id/resources/vibecoding-demo", "/resources/vibecoding-demo"],
  ])("reroutes canonical %s to %s", (pathname, route) => {
    expect(rerouteLocalizedPath(pathname)).toBe(route)
  })

  it.each([
    "/",
    "/about",
    "/en/cv",
    "/id/id/cv",
    "/id/unknown",
    "/id/resources/vibecoding-workshop.pdf",
  ])("does not reroute non-canonical path %s", (pathname) => {
    expect(rerouteLocalizedPath(pathname)).toBeUndefined()
  })
})

describe("locale alias redirects", () => {
  it.each([
    ["https://chrsep.dev/en/cv", "/cv"],
    ["https://chrsep.dev/id/id/cv", "/id/cv"],
    ["https://chrsep.dev/en/id/cv", "/id/cv"],
    ["https://chrsep.dev/id/en/cv", "/cv"],
    ["https://chrsep.dev/en", "/"],
    ["https://chrsep.dev/en/id", "/id"],
    ["https://chrsep.dev/id/en", "/"],
    ["https://chrsep.dev/en/cv?ref=seo&lang=en", "/cv?ref=seo&lang=en"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(getLocaleAliasRedirect(new URL(input))).toBe(expected)
  })

  it.each([
    "https://chrsep.dev/",
    "https://chrsep.dev/cv",
    "https://chrsep.dev/id",
    "https://chrsep.dev/id/cv",
    "https://chrsep.dev/id/unknown",
  ])("leaves canonical or ordinary path %s alone", (input) => {
    expect(getLocaleAliasRedirect(new URL(input))).toBeUndefined()
  })

  it.each([
    "https://chrsep.dev/en/studio",
    "https://chrsep.dev/id/en/studio/settings",
    "https://chrsep.dev/en/sitemap.xml",
    "https://chrsep.dev/en/robots.txt",
    "https://chrsep.dev/en/resources/vibecoding-workshop.pdf",
    "https://chrsep.dev/en/resources/vibecoding-demo/agent-sessions/index.json",
  ])("never normalizes excluded path %s", (input) => {
    expect(getLocaleAliasRedirect(new URL(input))).toBeUndefined()
  })
})

describe("localization exclusions", () => {
  it.each([
    "/sitemap.xml",
    "/robots.txt",
    "/studio",
    "/studio/static/favicon.svg",
    "/resources/vibecoding-workshop.pdf",
    "/resources/vibecoding-demo/agent-sessions",
    "/resources/vibecoding-demo/agent-sessions/media/image.webp",
  ])("excludes %s", (pathname) => {
    expect(isLocalizationExcludedPath(pathname)).toBe(true)
  })

  it.each(["/", "/cv", "/resources/vibecoding-demo"])(
    "keeps page route %s localizable",
    (pathname) => {
      expect(isLocalizationExcludedPath(pathname)).toBe(false)
    },
  )
})

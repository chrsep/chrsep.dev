import { browser, dev } from "$app/environment"
import posthog, { type CaptureResult } from "posthog-js"

const APP_SURFACE = "website"
const MASKED_CONTENT_SELECTOR =
  "[data-analytics-mask], [data-private], .ph-mask"
const URL_PROPERTY_PATTERN =
  /(?:^|[_$])(?:url|uri|href|referrer|filename|abs_path)$/i
const PAGE_LOCATION_URL_PROPERTY_PATTERN =
  /(?:^|[_$])(?:url|uri|href|referrer)$/i
const PATHNAME_PROPERTY_PATTERN = /(?:^|[_$])(?:pathname|url_path)$/i
const URL_IN_TEXT_PATTERN = /https?:\/\/[^\s<>"']+/gi
const RELATIVE_PATH_IN_TEXT_PATTERN = /(^|[\s([{"'])(\/[^\s<>"')\]}]+)/g
const ELEMENT_CHAIN_URL_ATTRIBUTE_PATTERN =
  /((?:attr__)?(?:href|src)=")([^"]*)(")/gi
const DIRECT_REFERRER = "$direct"

let initializationState: "idle" | "initialized" | "suppressed" | "failed" =
  "idle"
let pageContext: Partial<SharedAnalyticsContext> = {}

type SharedAnalyticsContext = {
  environment: string
  release: string
  app_surface: string
  locale: string
  route: string
}

const ROUTE_IDS: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/cv": "cv",
  "/resources/vibecoding-demo": "vibecoding_demo",
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function redactPathname(value: string) {
  const pathname = value.split(/[?#]/, 1)[0] || "/"
  const segments = pathname.split("/").filter(Boolean)
  const localeOffset = segments[0] === "id" ? 1 : 0
  const knownRootSegments = new Set(["about", "cv", "resources"])

  const normalized = segments.map((segment, index) => {
    if (index === 0 && segment === "id") return "id"
    if (index === localeOffset && knownRootSegments.has(segment)) {
      return segment
    }
    return ":unknown"
  })

  return normalized.length > 0 ? `/${normalized.join("/")}` : "/"
}

export function redactUrl(value: string, maskPathname = false) {
  try {
    const isAbsolute = /^[a-z][a-z\d+.-]*:/i.test(value)
    const url = new URL(
      value,
      browser ? window.location.origin : "https://chrsep.dev",
    )

    url.username = ""
    url.password = ""
    url.search = ""
    url.hash = ""
    if (maskPathname) url.pathname = redactPathname(url.pathname)

    if (!isAbsolute) return `${url.pathname}`
    if (url.protocol === "http:" || url.protocol === "https:") {
      return `${url.origin}${url.pathname}`
    }

    return `${url.protocol}${url.pathname}`
  } catch {
    const valueWithoutQuery = value.split(/[?#]/, 1)[0]
    return maskPathname ? redactPathname(valueWithoutQuery) : valueWithoutQuery
  }
}

function hasUnknownInternalPath(value: string) {
  try {
    const isAbsolute = /^[a-z][a-z\d+.-]*:/i.test(value)
    const baseOrigin = browser ? window.location.origin : "https://chrsep.dev"
    const url = new URL(value, baseOrigin)

    if (
      isAbsolute &&
      url.origin !== baseOrigin &&
      url.hostname !== "chrsep.dev"
    ) {
      return false
    }

    return inferRoute(url.pathname) === "unknown"
  } catch {
    return false
  }
}

function redactValue(
  value: unknown,
  propertyName = "",
  maskUnknownPath = false,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, propertyName, maskUnknownPath))
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        redactValue(item, key, maskUnknownPath),
      ]),
    )
  }

  if (
    typeof value === "string" &&
    value === DIRECT_REFERRER &&
    /referrer$/i.test(propertyName)
  ) {
    return value
  }

  if (typeof value === "string" && URL_PROPERTY_PATTERN.test(propertyName)) {
    const maskLocationPath =
      PAGE_LOCATION_URL_PROPERTY_PATTERN.test(propertyName) &&
      (maskUnknownPath || hasUnknownInternalPath(value))

    return redactUrl(value, maskLocationPath)
  }

  if (
    typeof value === "string" &&
    PATHNAME_PROPERTY_PATTERN.test(propertyName)
  ) {
    const maskLocationPath = maskUnknownPath || inferRoute(value) === "unknown"
    return redactUrl(value, maskLocationPath)
  }

  if (typeof value === "string" && propertyName === "$elements_chain") {
    return value.replace(
      ELEMENT_CHAIN_URL_ATTRIBUTE_PATTERN,
      (_match, prefix: string, url: string, suffix: string) =>
        `${prefix}${redactUrl(
          url,
          maskUnknownPath || hasUnknownInternalPath(url),
        )}${suffix}`,
    )
  }

  if (
    typeof value === "string" &&
    (propertyName === "$exception_message" || propertyName === "value")
  ) {
    return value
      .replace(URL_IN_TEXT_PATTERN, (url) =>
        redactUrl(url, maskUnknownPath || hasUnknownInternalPath(url)),
      )
      .replace(
        RELATIVE_PATH_IN_TEXT_PATTERN,
        (_match, prefix: string, path: string) =>
          `${prefix}${redactUrl(
            path,
            maskUnknownPath || hasUnknownInternalPath(path),
          )}`,
      )
  }

  return value
}

export function redactAnalyticsEvent(
  event: CaptureResult | null,
): CaptureResult | null {
  try {
    if (!event) return event

    const properties = isRecord(event.properties) ? event.properties : {}
    const hasExplicitRoute =
      typeof properties.route === "string" ||
      typeof properties.route_id === "string"
    const maskUnknownPath =
      properties.route === "unknown" ||
      properties.route_id === "unknown" ||
      (!hasExplicitRoute && inferRoute() === "unknown")

    return {
      ...event,
      properties: redactValue(
        event.properties,
        "",
        maskUnknownPath,
      ) as CaptureResult["properties"],
    }
  } catch {
    return null
  }
}

function runtimeIsSuppressed() {
  const configuredEnvironment =
    import.meta.env.PUBLIC_POSTHOG_ENVIRONMENT?.toLowerCase()
  const deploymentEnvironment = __APP_ENVIRONMENT__.toLowerCase()

  return (
    !browser ||
    dev ||
    import.meta.env.MODE === "test" ||
    deploymentEnvironment === "preview" ||
    configuredEnvironment === "development" ||
    configuredEnvironment === "test" ||
    import.meta.env.PUBLIC_POSTHOG_DISABLED?.toLowerCase() === "true"
  )
}

function inferLocale(pathname = browser ? window.location.pathname : "/") {
  return pathname === "/id" || pathname.startsWith("/id/") ? "id" : "en"
}

function inferRoute(pathname = browser ? window.location.pathname : "/") {
  const pathnameWithoutQuery = pathname.split(/[?#]/, 1)[0]
  const withoutLocale = pathnameWithoutQuery.replace(/^\/id(?=\/|$)/, "") || "/"
  const normalizedPath =
    withoutLocale !== "/" && withoutLocale.endsWith("/")
      ? withoutLocale.slice(0, -1)
      : withoutLocale

  return ROUTE_IDS[normalizedPath] ?? "unknown"
}

export function getSharedAnalyticsContext() {
  return {
    environment: __APP_ENVIRONMENT__,
    release: __APP_RELEASE__,
    app_surface: APP_SURFACE,
    ...pageContext,
    locale: inferLocale(),
    route: inferRoute(),
  }
}

export function registerAnalyticsContext(
  context: Partial<SharedAnalyticsContext> = {},
) {
  if (initializationState !== "initialized") return

  try {
    pageContext = {
      ...pageContext,
      ...Object.fromEntries(
        Object.entries(context).filter(([, value]) => value !== undefined),
      ),
    }
    posthog.register(getSharedAnalyticsContext())
  } catch {
    // Analytics must never interrupt navigation or rendering.
  }
}

export function initPostHog() {
  if (initializationState === "initialized") return true
  if (initializationState !== "idle") return false

  if (runtimeIsSuppressed()) {
    initializationState = "suppressed"
    return false
  }

  const key = import.meta.env.PUBLIC_POSTHOG_KEY?.trim()
  const host = import.meta.env.PUBLIC_POSTHOG_HOST?.trim()
  if (!key || !host) {
    initializationState = "suppressed"
    return false
  }

  try {
    posthog.init(key, {
      api_host: host,
      defaults: "2026-06-25",
      autocapture: true,
      capture_pageview: false,
      capture_pageleave: true,
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: true,
      },
      capture_performance: {
        network_timing: true,
        web_vitals: true,
        web_vitals_attribution: true,
      },
      capture_heatmaps: true,
      capture_dead_clicks: true,
      advanced_disable_flags: inferRoute() === "unknown",
      advanced_disable_feature_flags: true,
      advanced_disable_feature_flags_on_first_load: true,
      person_profiles: "never",
      respect_dnt: true,
      disable_capture_url_hashes: true,
      mask_personal_data_properties: true,
      custom_personal_data_properties: ["session", "token", "code", "state"],
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: MASKED_CONTENT_SELECTOR,
        recordBody: false,
        recordHeaders: false,
        maskCapturedNetworkRequestFn: (request) => ({
          ...request,
          name: request.name
            ? redactUrl(request.name, hasUnknownInternalPath(request.name))
            : request.name,
        }),
      },
      before_send: redactAnalyticsEvent,
    })

    initializationState = "initialized"
    registerAnalyticsContext()
    return true
  } catch {
    initializationState = "failed"
    return false
  }
}

export function isPostHogReady() {
  return initializationState === "initialized"
}

export { posthog }

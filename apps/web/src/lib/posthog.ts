import { browser, dev } from "$app/environment"
import type { CaptureResult } from "posthog-js"
import {
  inferAnalyticsRoute,
  isInternalHostname,
  SITE_ORIGIN,
} from "$lib/routes"

type PostHogClient = (typeof import("posthog-js"))["default"]
type AnalyticsProperties = Record<string, unknown>
type QueuedOperation =
  | {
      type: "capture"
      event: string
      properties?: AnalyticsProperties
    }
  | {
      type: "capture_exception"
      error: unknown
      properties?: AnalyticsProperties
    }

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

let initializationState:
  | "idle"
  | "scheduled"
  | "loading"
  | "initialized"
  | "suppressed"
  | "failed" = "idle"
let clientPromise: Promise<PostHogClient | null> | null = null
let client: PostHogClient | null = null
let entryRoute: string | null = null
let pageContext: Partial<SharedAnalyticsContext> = {}
const operationQueue: QueuedOperation[] = []

type SharedAnalyticsContext = {
  environment: string
  release: string
  app_surface: string
  locale: string
  route: string
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
    const url = new URL(value, browser ? window.location.origin : SITE_ORIGIN)

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
    const baseOrigin = browser ? window.location.origin : SITE_ORIGIN
    const url = new URL(value, baseOrigin)

    if (
      isAbsolute &&
      url.origin !== baseOrigin &&
      !isInternalHostname(url.hostname)
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
  return inferAnalyticsRoute(pathname)
}

export function getSharedAnalyticsContext() {
  // Inferred locale/route are fallbacks only; anything explicitly registered via
  // registerAnalyticsContext (spread last) must win.
  return {
    environment: __APP_ENVIRONMENT__,
    release: __APP_RELEASE__,
    app_surface: APP_SURFACE,
    locale: inferLocale(),
    route: inferRoute(),
    ...pageContext,
  }
}

export function registerAnalyticsContext(
  context: Partial<SharedAnalyticsContext> = {},
) {
  pageContext = {
    ...pageContext,
    ...Object.fromEntries(
      Object.entries(context).filter(([, value]) => value !== undefined),
    ),
  }

  if (!client) return

  try {
    client.register(getSharedAnalyticsContext())
  } catch {
    // Analytics must never interrupt navigation or rendering.
  }
}

function executeOperation(
  posthogClient: PostHogClient,
  operation: QueuedOperation,
) {
  try {
    if (operation.type === "capture") {
      posthogClient.capture(operation.event, operation.properties)
      return
    }

    posthogClient.captureException(operation.error, operation.properties)
  } catch {
    // Analytics must never interrupt the action being measured.
  }
}

function flushOperationQueue(posthogClient: PostHogClient) {
  for (const operation of operationQueue.splice(0)) {
    executeOperation(posthogClient, operation)
  }
}

function startClientLoad(key: string, host: string) {
  if (initializationState !== "scheduled" || clientPromise) return

  initializationState = "loading"
  clientPromise = import("posthog-js")
    .then(({ default: loadedPostHog }) => {
      loadedPostHog.init(key, {
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
        advanced_disable_flags: entryRoute === "unknown",
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

      client = loadedPostHog
      initializationState = "initialized"

      try {
        loadedPostHog.register(getSharedAnalyticsContext())
      } catch {
        // Captures still work when shared-property registration is unavailable.
      }

      flushOperationQueue(loadedPostHog)
      return loadedPostHog
    })
    .catch(() => {
      client = null
      initializationState = "failed"

      // Surface genuine application errors even when PostHog is blocked, and
      // account for the analytics captures that can no longer be delivered.
      let droppedAnalyticsOps = 0
      for (const operation of operationQueue.splice(0)) {
        if (operation.type === "capture_exception") {
          if (operation.properties) {
            console.error(operation.error, operation.properties)
          } else {
            console.error(operation.error)
          }
        } else {
          droppedAnalyticsOps += 1
        }
      }
      if (droppedAnalyticsOps > 0) {
        console.warn(
          `PostHog failed to load; dropped ${droppedAnalyticsOps} queued analytics event(s).`,
        )
      }

      return null
    })
}

function scheduleClientLoad(key: string, host: string) {
  const load = () => startClientLoad(key, host)

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(load, { timeout: 2_000 })
  } else {
    globalThis.setTimeout(load, 1_000)
  }
}

export function initPostHog() {
  if (
    initializationState === "scheduled" ||
    initializationState === "loading" ||
    initializationState === "initialized"
  ) {
    return true
  }
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

  entryRoute = inferRoute()
  initializationState = "scheduled"
  scheduleClientLoad(key, host)
  return true
}

function dispatch(operation: QueuedOperation) {
  if (!initPostHog()) return

  if (client) {
    executeOperation(client, operation)
    return
  }

  operationQueue.push(operation)
}

export const posthog = {
  capture(event: string, properties?: AnalyticsProperties) {
    dispatch({ type: "capture", event, properties })
  },
  captureException(error: unknown, properties?: AnalyticsProperties) {
    dispatch({ type: "capture_exception", error, properties })
  },
}

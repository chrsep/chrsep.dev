import {
  getSharedAnalyticsContext,
  initPostHog,
  posthog,
  redactUrl,
  registerAnalyticsContext,
} from "$lib/posthog"

type AnalyticsPrimitive = string | number | boolean | null
type AnalyticsValue =
  | AnalyticsPrimitive
  | AnalyticsPrimitive[]
  | { [key: string]: AnalyticsValue | undefined }

type EventProperties = {
  [key: string]: AnalyticsValue | undefined
}

type OutboundLinkProperties = EventProperties & {
  destination_id: string
  destination_host: string
  placement: string
  category?: string
  project_id?: string
  project_title?: string
}

export interface AnalyticsEventMap {
  "contact cta clicked": EventProperties & {
    location: string
    destination: string
  }
  "outbound link clicked": OutboundLinkProperties
  "asset download clicked": EventProperties & {
    asset_id: string
    asset_type: string
    asset_host: string
    placement: string
  }
  "language changed": EventProperties & {
    from_locale: string
    to_locale: string
  }
  "project card viewed": EventProperties & {
    project_id: string
    project_title: string
    position: number
    visibility_ratio?: number
  }
  "resource tab selected": EventProperties & {
    content_id: string
    tab_id: string
    selection_method: string
  }
  "content section viewed": EventProperties & {
    content_id: string
    section_id: string
    content_type?: string
    position?: number
  }
  "agent session selected": EventProperties & {
    content_id: string
    session_slug: string
    selection_surface: string
  }
  "agent session read": EventProperties & {
    content_id: string
    session_slug: string
    percent_read: number
  }
  "content retry clicked": EventProperties & {
    content_id: string
    operation: string
    status: string
    session_slug?: string
  }
  "content load completed": EventProperties & {
    content_id: string
    operation: string
    status: string
    duration_ms: number
  }
  "content load recovered": EventProperties & {
    content_id: string
    operation: string
    status: string
    duration_ms: number
  }
  "resource load failed": EventProperties & {
    content_id: string
    operation: string
    resource_type: string
    asset_id: string
  }
  "agent activity expanded": EventProperties & {
    content_id: string
    session_slug: string
    activity_id: string
    activity_index: number
    activity_status: string
    detail_count: number
  }
  "page not found viewed": EventProperties & {
    status: 404
    path_pattern: string
    path_depth: number
    referrer_type: "none" | "same_origin" | "external"
  }
}

export type AnalyticsEventName = keyof AnalyticsEventMap

export type PageviewContext = {
  route_id?: string
  locale?: string
  app_surface?: string
}

export function capture<EventName extends AnalyticsEventName>(
  eventName: EventName,
  properties: AnalyticsEventMap[EventName],
) {
  try {
    if (!initPostHog()) return

    posthog.capture(eventName, {
      ...getSharedAnalyticsContext(),
      ...properties,
    })
  } catch {
    // Analytics must never interrupt the action being measured.
  }
}

export function captureOutboundLink(
  link: { destination_id: string; url: string; placement: string },
  extra: EventProperties = {},
) {
  try {
    capture("outbound link clicked", {
      ...extra,
      destination_id: link.destination_id,
      destination_host: new URL(link.url).hostname,
      placement: link.placement,
    })
  } catch {
    // A malformed URL must never interrupt the navigation being measured.
  }
}

export function capturePageview(
  currentUrl = typeof window === "undefined" ? undefined : window.location.href,
  context: PageviewContext = {},
) {
  try {
    if (!currentUrl || !initPostHog()) return

    registerAnalyticsContext({
      ...(context.locale ? { locale: context.locale } : {}),
      ...(context.route_id ? { route: context.route_id } : {}),
      ...(context.app_surface ? { app_surface: context.app_surface } : {}),
    })
    posthog.capture("$pageview", {
      ...getSharedAnalyticsContext(),
      ...context,
      $current_url: redactUrl(currentUrl),
    })
  } catch {
    // Pageview tracking must not interrupt navigation.
  }
}

export function captureException(
  error: unknown,
  context: EventProperties = {},
) {
  try {
    if (!initPostHog()) return

    posthog.captureException(error, {
      ...getSharedAnalyticsContext(),
      ...context,
    })
  } catch {
    // Error reporting must never replace the original application error.
  }
}

import { browser } from "$app/environment"
import { env } from "$env/dynamic/public"

type PostHogClient = (typeof import("posthog-js"))["default"]
type QueuedEvent = {
  event: string
  properties?: Record<string, unknown>
}

let clientPromise: Promise<PostHogClient | null> | null = null
let client: PostHogClient | null = null
let initializationUnavailable = false
let flushScheduled = false
const eventQueue: QueuedEvent[] = []

export function initPostHog(): Promise<PostHogClient | null> {
  if (!browser) return Promise.resolve(null)
  if (clientPromise) return clientPromise

  const key = env.PUBLIC_POSTHOG_KEY
  const host = env.PUBLIC_POSTHOG_HOST

  if (!key || !host) {
    initializationUnavailable = true
    return Promise.resolve(null)
  }

  clientPromise = import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false,
        capture_exceptions: true,
      })
      client = posthog
      return posthog
    })
    .catch(() => {
      initializationUnavailable = true
      return null
    })

  return clientPromise
}

function scheduleFlush() {
  if (!browser || flushScheduled || initializationUnavailable) return

  flushScheduled = true
  const flush = () => {
    flushScheduled = false

    void initPostHog().then((posthog) => {
      if (!posthog) {
        eventQueue.length = 0
        return
      }

      for (const queuedEvent of eventQueue.splice(0)) {
        posthog.capture(queuedEvent.event, queuedEvent.properties)
      }
    })
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(flush, { timeout: 2_000 })
  } else {
    globalThis.setTimeout(flush, 1_000)
  }
}

export function capture(
  event: string,
  properties?: Record<string, unknown>,
): void {
  if (!browser) return

  if (client) {
    client.capture(event, properties)
    return
  }

  eventQueue.push({ event, properties })
  scheduleFlush()
}

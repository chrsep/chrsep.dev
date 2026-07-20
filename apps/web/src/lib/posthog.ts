import posthog from "posthog-js"
import { browser } from "$app/environment"
import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_HOST } from "$env/static/public"

export function initPostHog() {
  if (!browser) return
  posthog.init(PUBLIC_POSTHOG_KEY, {
    api_host: PUBLIC_POSTHOG_HOST,
    capture_pageview: false,
    capture_exceptions: true,
  })
}

export { posthog }

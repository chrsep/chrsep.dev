import type { HandleClientError } from "@sveltejs/kit"
import { captureException } from "$lib/analytics"
import { initPostHog } from "$lib/posthog"

initPostHog()

export const handleError: HandleClientError = ({ error, event, status }) => {
  const pathDepth = event.url.pathname.split("/").filter(Boolean).length

  captureException(error, {
    source: "sveltekit_handle_error",
    status,
    route_id: event.route.id ?? "unknown",
    path_depth: pathDepth,
  })

  return {
    message: "Something went wrong while loading this page.",
  }
}

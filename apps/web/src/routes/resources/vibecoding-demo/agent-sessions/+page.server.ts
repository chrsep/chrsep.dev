import { redirect } from "@sveltejs/kit"
import { localizeHref } from "$lib/paraglide/runtime"
import { defaultSessionSlug } from "$lib/vibecoding/agent-sessions/manifest"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = () => {
  redirect(
    308,
    localizeHref(
      `/resources/vibecoding-demo/agent-sessions/${defaultSessionSlug}`,
    ),
  )
}

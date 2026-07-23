import type { Reroute } from "@sveltejs/kit"
import { rerouteLocalizedPath } from "$lib/url-normalization"

export const reroute: Reroute = ({ url }) => rerouteLocalizedPath(url.pathname)

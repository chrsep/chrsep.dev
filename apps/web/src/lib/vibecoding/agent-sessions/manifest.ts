import manifestJson from "../../../../static/resources/vibecoding-demo/agent-sessions/index.json"
import { isSessionManifest } from "./guards"
import type { SessionManifest } from "./types"

function loadManifest(): SessionManifest {
  if (!isSessionManifest(manifestJson)) {
    throw new Error(
      "Invalid agent session manifest at static/resources/vibecoding-demo/agent-sessions/index.json",
    )
  }
  return manifestJson
}

export const manifest = loadManifest()

export const defaultSessionSlug =
  manifest.sessions.find((session) => session.slug === manifest.defaultSession)
    ?.slug ?? manifest.sessions[0].slug

import { isSessionTranscript } from "./guards"
import type { SessionTranscript } from "./types"
import { manifest } from "./manifest"

// Transcripts are bundled at build time and validated once at module init, so
// a corrupt published file fails the (prerendered) build instead of a visitor.
const transcriptModules = import.meta.glob<{ default: unknown }>(
  "/static/resources/vibecoding-demo/agent-sessions/sessions/*.json",
  { eager: true },
)

const transcripts = new Map<string, SessionTranscript>()

for (const session of manifest.sessions) {
  const data = transcriptModules[`/static${session.dataUrl}`]?.default
  if (!isSessionTranscript(data) || data.slug !== session.slug) {
    throw new Error(
      `Invalid or missing transcript for agent session "${session.slug}"`,
    )
  }
  transcripts.set(session.slug, data)
}

export function getTranscript(slug: string): SessionTranscript | undefined {
  return transcripts.get(slug)
}

export { manifest, defaultSessionSlug } from "./manifest"

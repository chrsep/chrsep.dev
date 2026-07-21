import { error } from "@sveltejs/kit"
import {
  getTranscript,
  manifest,
} from "$lib/vibecoding/agent-sessions/data.server"
import type { EntryGenerator, PageServerLoad } from "./$types"

export const entries: EntryGenerator = () =>
  manifest.sessions.map((session) => ({ slug: session.slug }))

export const load: PageServerLoad = ({ params }) => {
  const session = manifest.sessions.find((item) => item.slug === params.slug)
  const transcript = getTranscript(params.slug)
  if (!session || !transcript) error(404, "Session not found")

  return { manifest, session, transcript }
}

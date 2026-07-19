export const activityCategories = [
  "Inspect",
  "Edit",
  "Run",
  "Verify",
  "Browser",
  "Database",
  "Git",
  "Deploy",
  "Plan",
] as const

export type ActivityCategory = (typeof activityCategories)[number]

export type ActivityDetail = {
  category: ActivityCategory
  label: string
  description?: string
}

export type TranscriptEntry =
  | {
      type: "message"
      role: "user" | "assistant"
      variant?: "progress" | "final"
      html: string
    }
  | {
      type: "activity"
      summary: string
      status: "completed" | "failed" | "interrupted"
      details: ActivityDetail[]
    }
  | {
      type: "media"
      src: string
      width: number
      height: number
      alt: string
      caption?: string
    }

export type SessionSummary = {
  slug: string
  title: string
  startedAt: string
  durationMs: number | null
  messageCount: number
  actionCount: number
  dataUrl: string
}

export type SessionManifest = {
  schemaVersion: 1
  project: "Inventory"
  defaultSession: string
  sessions: SessionSummary[]
}

export type SessionTranscript = {
  schemaVersion: 1
  slug: string
  title: string
  entries: TranscriptEntry[]
}

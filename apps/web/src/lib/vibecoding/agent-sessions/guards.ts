import {
  activityCategories,
  type ActivityDetail,
  type SessionManifest,
  type SessionSummary,
  type SessionTranscript,
  type TranscriptEntry,
} from "./types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string"
}

const publishedHtmlTags = new Set([
  "a",
  "blockquote",
  "br",
  "code",
  "del",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "hr",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
])

const publishedHtmlVoidTags = new Set(["br", "hr"])

function isSafePublishedHtml(value: unknown): value is string {
  if (!isNonEmptyString(value) || /<!--[\s\S]*?-->|<!|<\?/i.test(value)) {
    return false
  }

  const openTags: string[] = []
  const tagPattern = /<[^>]+>/g
  let cursor = 0

  for (const match of value.matchAll(tagPattern)) {
    const token = match[0]
    const index = match.index ?? 0
    if (value.slice(cursor, index).includes("<")) return false

    const closing = token.match(/^<\/([a-z][a-z0-9]*)\s*>$/i)
    if (closing) {
      const tag = closing[1].toLowerCase()
      if (!publishedHtmlTags.has(tag) || publishedHtmlVoidTags.has(tag)) {
        return false
      }
      if (openTags.pop() !== tag) return false
      cursor = index + token.length
      continue
    }

    const opening = token.match(/^<([a-z][a-z0-9]*)([^<>]*)>$/i)
    if (!opening) return false

    const tag = opening[1].toLowerCase()
    const attributes = opening[2]
    if (!publishedHtmlTags.has(tag)) return false

    if (tag === "a") {
      if (
        !/^ href="https?:\/\/[^"<>\s]+" rel="nofollow noopener noreferrer"$/i.test(
          attributes,
        )
      ) {
        return false
      }
    } else if (attributes.trim() && attributes.trim() !== "/") {
      return false
    }

    if (!publishedHtmlVoidTags.has(tag)) openTags.push(tag)
    cursor = index + token.length
  }

  return !value.slice(cursor).includes("<") && openTags.length === 0
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0
}

function isSafePublicPath(value: unknown): value is string {
  if (typeof value !== "string" || !value.startsWith("/")) return false
  if (value.startsWith("//") || value.includes("\\")) return false

  try {
    const parsed = new URL(value, "https://example.invalid")
    return parsed.origin === "https://example.invalid"
  } catch {
    return false
  }
}

function isSlug(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value))
}

function isSessionSummary(value: unknown): value is SessionSummary {
  if (!isRecord(value)) return false

  return (
    isSlug(value.slug) &&
    isNonEmptyString(value.title) &&
    isIsoDate(value.startedAt) &&
    (value.durationMs === null || isNonNegativeInteger(value.durationMs)) &&
    isNonNegativeInteger(value.messageCount) &&
    isNonNegativeInteger(value.actionCount) &&
    isSafePublicPath(value.dataUrl)
  )
}

function isActivityDetail(value: unknown): value is ActivityDetail {
  if (!isRecord(value)) return false

  return (
    typeof value.category === "string" &&
    activityCategories.includes(value.category as ActivityDetail["category"]) &&
    isNonEmptyString(value.label) &&
    isOptionalString(value.description)
  )
}

function isTranscriptEntry(value: unknown): value is TranscriptEntry {
  if (!isRecord(value)) return false

  if (value.type === "message") {
    return (
      (value.role === "user" || value.role === "assistant") &&
      (value.variant === undefined ||
        value.variant === "progress" ||
        value.variant === "final") &&
      isSafePublishedHtml(value.html)
    )
  }

  if (value.type === "activity") {
    return (
      isNonEmptyString(value.summary) &&
      (value.status === "completed" ||
        value.status === "failed" ||
        value.status === "interrupted") &&
      Array.isArray(value.details) &&
      value.details.every(isActivityDetail)
    )
  }

  if (value.type === "media") {
    return (
      isSafePublicPath(value.src) &&
      isNonNegativeInteger(value.width) &&
      value.width > 0 &&
      isNonNegativeInteger(value.height) &&
      value.height > 0 &&
      typeof value.alt === "string" &&
      isOptionalString(value.caption)
    )
  }

  return false
}

export function isSessionManifest(value: unknown): value is SessionManifest {
  if (
    !isRecord(value) ||
    value.schemaVersion !== 1 ||
    value.project !== "Inventory" ||
    typeof value.defaultSession !== "string" ||
    !Array.isArray(value.sessions) ||
    !value.sessions.every(isSessionSummary)
  ) {
    return false
  }

  const slugs = value.sessions.map((session) => session.slug)
  const hasUniqueSlugs = new Set(slugs).size === slugs.length

  if (!hasUniqueSlugs) return false
  if (value.sessions.length === 0) return value.defaultSession === ""

  return slugs.includes(value.defaultSession)
}

export function isSessionTranscript(
  value: unknown,
): value is SessionTranscript {
  if (!isRecord(value)) return false

  return (
    value.schemaVersion === 1 &&
    isSlug(value.slug) &&
    isNonEmptyString(value.title) &&
    Array.isArray(value.entries) &&
    value.entries.every(isTranscriptEntry)
  )
}

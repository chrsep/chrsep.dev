import crypto from "node:crypto"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { gzipSync } from "node:zlib"

import { marked } from "marked"
import sanitizeHtml from "sanitize-html"
import sharp from "sharp"

export const SCHEMA_VERSION = 1
export const MANIFEST_LIMIT_BYTES = 15 * 1024
export const SESSION_LIMIT_BYTES = 500 * 1024
export const SESSION_GZIP_LIMIT_BYTES = 150 * 1024

export const SESSION_ALLOWLIST = Object.freeze([
  {
    id: "019f737f-ced5-7470-a7eb-b167635d50ac",
    slug: "ubah-tema-menjadi-dark-mode",
    title: "Ubah tema menjadi dark mode",
  },
  {
    id: "019f737e-91e7-70f1-96d8-3c529605c0d3",
    slug: "plan-dark-theme-update",
    title: "Plan dark theme update",
  },
  {
    id: "019f7371-06d0-7a12-92c6-52941f2d6b18",
    slug: "create-repository-guidelines",
    title: "Create repository guidelines",
  },
  {
    id: "019f7367-2c28-7eb3-9d83-7a0cea5bb084",
    slug: "tambah-fitur-revert-pengembalian",
    title: "Tambah fitur revert pengembalian",
  },
  {
    id: "019f7347-f9a8-7eb2-8b45-02303b1e967c",
    slug: "deploy-ke-github-dan-vercel",
    title: "Deploy ke GitHub dan Vercel",
  },
  {
    id: "019f734e-37d8-7572-b892-e486785305f7",
    slug: "ubah-ke-dark-theme",
    title: "Ubah ke dark theme",
  },
  {
    id: "019f732a-8585-71f0-9c69-deccbe89e4ba",
    slug: "setup-inventory-tracking-app",
    title: "Setup inventory tracking app",
  },
])

export const DEFAULT_SESSION = "setup-inventory-tracking-app"

const REVIEWED_MEDIA = Object.freeze({
  "59ab6035202d278eefa4144c7e041bfd2f9a21c92f949fab55462fcc0d16535c": {
    alt: "Inventory dashboard on desktop",
    caption: "Desktop dashboard review",
  },
  "2de986803252bee2c377721545e9e1b72ae72f5bdcc381a49cc2a7368dc86dbf": {
    alt: "Inventory dashboard on a mobile viewport",
    caption: "Responsive dashboard verification",
  },
})

const EXTERNAL_REVIEWED_MEDIA = Object.freeze({
  "ubah-ke-dark-theme": [
    {
      sourcePath: "/private/tmp/inventory-overview-light.png",
      sourceHash:
        "9eac0a510348826a12f5ede47c7ed4d422566740c69ed37c6062d2c4f6835765",
      alt: "Inventory dashboard before the dark theme update",
      caption: "Current dashboard review",
    },
    {
      sourcePath: "/private/tmp/inventory-list-light.png",
      sourceHash:
        "bdf403decb487fd8caad3251794b61fa92364be359cdc4ee4f112f638bec60e9",
      alt: "Inventory item list before the dark theme update",
      caption: "Inventory screen review",
    },
    {
      sourcePath: "/private/tmp/inventory-loan-modal-light.png",
      sourceHash:
        "795b69749e525a9efa14a07e298f5079ed51c936234a7d7b12218e0f17ab5c00",
      alt: "New loan dialog before the dark theme update",
      caption: "Loan dialog review",
    },
    {
      sourcePath: "/private/tmp/inventory-mobile-light.png",
      sourceHash:
        "5395a764eeff7820550ff119cf5e42a332eb0581b11618b1728a2c6c59c1104f",
      alt: "Inventory dashboard on a mobile viewport before the dark theme update",
      caption: "Mobile dashboard review",
    },
  ],
  "tambah-fitur-revert-pengembalian": [
    {
      sourcePath: "/tmp/inventory-revert-dialog.png",
      sourceHash:
        "e8196909547cce35acd2bca4efa8f330abb9febfa2c1c78956fa781b9b8f1168",
      alt: "Revert loan return confirmation dialog",
      caption: "Desktop revert flow verification",
    },
    {
      sourcePath: "/tmp/inventory-revert-dialog-mobile.png",
      sourceHash:
        "9d070a238a74496599244205d362925f614c249e3213503353db97083c713130",
      alt: "Revert loan return confirmation dialog on mobile",
      caption: "Mobile revert flow verification",
    },
  ],
})

const KNOWN_RECORD_TYPES = new Set([
  "compacted",
  "event_msg",
  "response_item",
  "session_meta",
  "turn_context",
  "world_state",
])

const KNOWN_RESPONSE_TYPES = new Set([
  "custom_tool_call",
  "custom_tool_call_output",
  "function_call",
  "function_call_output",
  "message",
  "reasoning",
])

const KNOWN_EVENT_TYPES = new Set([
  "agent_message",
  "agent_reasoning",
  "context_compacted",
  "mcp_tool_call_end",
  "patch_apply_end",
  "task_complete",
  "task_started",
  "thread_settings_applied",
  "token_count",
  "turn_aborted",
  "user_message",
])

const ALLOWED_AGENT_PHASES = new Set(["commentary", "final_answer"])
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png"])
const INVENTORY_ROOT = path.join(os.homedir(), "Documents", "Inventory")
const PUBLIC_BASE = "/resources/vibecoding-demo/agent-sessions"

const SAFE_HTML_OPTIONS = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "del",
    "code",
    "pre",
    "blockquote",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "a",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "hr",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "rel"],
  },
  allowedSchemes: ["http", "https"],
  allowedSchemesAppliedToAttributes: ["href"],
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attributes) => {
      const href = attributes.href
      if (!href || !/^https?:\/\//i.test(href)) {
        return { tagName: "span", attribs: {} }
      }

      return {
        tagName,
        attribs: {
          href,
          rel: "nofollow noopener noreferrer",
        },
      }
    },
  },
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex")
}

function parseTimestamp(value, label) {
  const milliseconds = Date.parse(value)
  if (!Number.isFinite(milliseconds)) {
    throw new Error(`Invalid timestamp in ${label}`)
  }
  return milliseconds
}

function stripAmbientContext(value) {
  return value
    .replace(
      /<in-app-browser-context\b[^>]*>[\s\S]*?<\/in-app-browser-context>/gi,
      "",
    )
    .replace(/^\s*## My request for Codex:\s*/i, "")
    .trim()
}

function redactUrl(rawUrl) {
  const trailingMatch = rawUrl.match(/[.,;:!?]+$/)
  const trailing = trailingMatch?.[0] ?? ""
  const candidate = trailing ? rawUrl.slice(0, -trailing.length) : rawUrl

  try {
    const url = new URL(candidate)
    if (url.username || url.password) return `[private URL redacted]${trailing}`

    if (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "0.0.0.0" ||
      url.hostname === "::1"
    ) {
      return `local preview ${url.pathname || "/"}${trailing}`
    }

    const authPath = `${url.pathname}${url.search}`
    if (
      /(?:oauth|authorize|auth|login|sign-?in|access[_-]?token|id[_-]?token)/i.test(
        authPath,
      )
    ) {
      return `[private sign-in URL removed]${trailing}`
    }

    url.username = ""
    url.password = ""
    url.search = ""
    url.hash = ""
    return `${url.toString()}${trailing}`
  } catch {
    return `[private URL redacted]${trailing}`
  }
}

export function redactText(value) {
  if (typeof value !== "string") throw new Error("Public text must be a string")

  let output = stripAmbientContext(value)

  output = output.replace(
    /(?:file:\/\/)?\/Users\/[^/\s]+\/Documents\/Inventory(?:\/([^\s)\]}>,'"`]+))?/g,
    (_match, relativePath) => relativePath || "Inventory project",
  )
  output = output.replace(
    /(?:file:\/\/)?\/(?:Users\/[^\s)\]}>,'"`]+|private\/(?:var|tmp)\/[^\s)\]}>,'"`]+|var\/folders\/[^\s)\]}>,'"`]+|tmp\/[^\s)\]}>,'"`]+)/g,
    "[local path redacted]",
  )
  output = output.replace(
    /\b(?:postgres(?:ql)?|mongodb(?:\+srv)?|redis|mysql):\/\/[^\s<>)\]]+/gi,
    "[database URL redacted]",
  )
  output = output.replace(
    /\b(?:sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9]{12,}|github_pat_[A-Za-z0-9_]{12,}|xox[baprs]-[A-Za-z0-9-]{12,})\b/g,
    "[credential redacted]",
  )
  output = output.replace(
    /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/gi,
    "Bearer [credential redacted]",
  )
  output = output.replace(
    /\b([A-Z][A-Z0-9_]{2,})\s*=\s*(?!\[redacted\])(?:["']?)([^\s"'`]+)/g,
    "$1=[redacted]",
  )
  output = output.replace(
    /data:[a-z0-9.+/-]+;base64,[a-z0-9+/=]+/gi,
    "[embedded data redacted]",
  )
  output = output.replace(
    /\b[A-Za-z0-9+/]{160,}={0,2}\b/g,
    "[encoded data redacted]",
  )
  output = output.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "[email redacted]",
  )
  output = output.replace(/\b(?:\+62|0)8\d{8,11}\b/g, "[phone redacted]")
  output = output.replace(
    /\bhttps?:\/\/(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(?::\d{1,5})?(?:\/[^\s<>)\]]*)?/g,
    "[local network address]",
  )
  output = output.replace(
    /\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(?::\d{1,5})?(?:\/[^\s<>)\]]*)?/g,
    "[local network address]",
  )
  output = output.replace(/\bcall_[A-Za-z0-9_-]+\b/g, "[call id redacted]")
  output = output.replace(
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
    "[internal id redacted]",
  )
  output = output.replace(
    /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi,
    (_match, label, url) => {
      const redactedUrl = redactUrl(url)
      if (
        redactedUrl.startsWith("local preview") ||
        redactedUrl.startsWith("[private") ||
        redactedUrl.startsWith("[local network")
      ) {
        return redactedUrl
      }
      return `[${label}](${redactedUrl})`
    },
  )
  output = output.replace(/https?:\/\/[^\s<>)\]'"`]+/gi, redactUrl)
  output = output.replace(
    /\b(?:file|javascript):[^\s<>)\]]+/gi,
    "[unsafe link redacted]",
  )
  output = output.replace(
    /!\[([^\]]*)\]\(\[local path redacted\]\)/g,
    (_match, alt) => `${alt || "Image"} (image omitted)`,
  )
  output = output.replace(/\[([^\]]+)\]\(\[local path redacted\]\)/g, "$1")

  return output.trim()
}

const UNSAFE_PUBLIC_PATTERNS = [
  [/(?:file:\/\/)?\/Users\//i, "home-directory path"],
  [/\/(?:private\/)?var\/folders\//i, "temporary-directory path"],
  [/\/(?:private\/)?tmp\//i, "temporary-directory path"],
  [/\b(?:postgres(?:ql)?|mongodb(?:\+srv)?|redis|mysql):\/\//i, "database URL"],
  [/\b(?:sk-|ghp_|github_pat_|xox[baprs]-)[A-Za-z0-9_-]{8,}/i, "credential"],
  [/\bBearer\s+(?!\[credential redacted\])/i, "bearer credential"],
  [/data:[a-z0-9.+/-]+;base64,/i, "embedded data URL"],
  [/\b[A-Za-z0-9+/]{160,}={0,2}\b/, "base64 payload"],
  [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, "contact email"],
  [/\b(?:\+62|0)8\d{8,11}\b/, "contact phone"],
  [
    /\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/,
    "local network address",
  ],
  [/\bcall_[A-Za-z0-9_-]+\b/, "raw call id"],
  [
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
    "raw internal id",
  ],
  [/https?:\/\/[^\s"<>]*\?[^\s"<>]*/i, "URL query"],
  [
    /https?:\/\/[^\s"<>]*(?:oauth|authorize|access[_-]?token)/i,
    "authentication URL",
  ],
  [/https?:\/\/[^\s"<>/@:]+:[^\s"<>/@]+@/i, "URL user info"],
  [/\b(?:file|javascript):/i, "unsafe link"],
  [/"(?:encrypted_content|turn_id|call_id)"\s*:/i, "internal field"],
]

export function assertPublicSafe(value, label = "public output") {
  const serialized = typeof value === "string" ? value : JSON.stringify(value)

  for (const [pattern, reason] of UNSAFE_PUBLIC_PATTERNS) {
    if (pattern.test(serialized)) {
      throw new Error(`Refusing to publish ${label}: found ${reason}`)
    }
  }

  const assignmentPattern = /\b([A-Z][A-Z0-9_]{2,})\s*=\s*([^\s<]+)/g
  for (const match of serialized.matchAll(assignmentPattern)) {
    if (!match[2].includes("[redacted]")) {
      throw new Error(`Refusing to publish ${label}: found environment value`)
    }
  }
}

export function renderMarkdown(value) {
  const redacted = redactText(value)
  if (!redacted) return ""

  const rendered = marked.parse(redacted, {
    async: false,
    gfm: true,
  })
  const html = sanitizeHtml(rendered, SAFE_HTML_OPTIONS).trim()
  assertPublicSafe(html, "message HTML")
  return html
}

export function parseJsonLines(source, sourceLabel = "session JSONL") {
  const records = []

  for (const [index, line] of source.split(/\r?\n/).entries()) {
    if (!line.trim()) continue

    let record
    try {
      record = JSON.parse(line)
    } catch {
      throw new Error(`Invalid JSON at ${sourceLabel}:${index + 1}`)
    }

    if (!record || typeof record !== "object" || Array.isArray(record)) {
      throw new Error(`Invalid record at ${sourceLabel}:${index + 1}`)
    }
    if (!KNOWN_RECORD_TYPES.has(record.type)) {
      throw new Error(`Unsupported record type: ${String(record.type)}`)
    }
    if (
      record.type === "response_item" &&
      !KNOWN_RESPONSE_TYPES.has(record.payload?.type)
    ) {
      throw new Error(
        `Unsupported response item: ${String(record.payload?.type)}`,
      )
    }
    if (
      record.type === "event_msg" &&
      !KNOWN_EVENT_TYPES.has(record.payload?.type)
    ) {
      throw new Error(`Unsupported event: ${String(record.payload?.type)}`)
    }

    records.push(record)
  }

  return records
}

function safeRelativeFile(absolutePath) {
  if (typeof absolutePath !== "string") return null

  if (absolutePath === INVENTORY_ROOT) return "Inventory project"
  if (!absolutePath.startsWith(`${INVENTORY_ROOT}/`)) return null

  const relative = path.posix.relative(INVENTORY_ROOT, absolutePath)
  if (
    !relative ||
    relative.startsWith("..") ||
    path.posix.isAbsolute(relative)
  ) {
    return null
  }
  return redactText(relative)
}

function categorizeActivity(title) {
  const normalized = title.toLowerCase()

  if (/test|lint|build|verify|validate|qa|check/.test(normalized))
    return "Verify"
  if (/deploy|vercel|production|domain/.test(normalized)) return "Deploy"
  if (/git|commit|push|branch|repository|repo\b/.test(normalized)) return "Git"
  if (/database|prisma|neon|schema|seed|migration/.test(normalized))
    return "Database"
  if (
    /browser|preview|screenshot|viewport|mobile|desktop|dialog|modal|page|layout|screen|visual/.test(
      normalized,
    )
  ) {
    return "Browser"
  }
  if (/plan|design|approach|strategy/.test(normalized)) return "Plan"
  if (/edit|update|create|write|implement|fix|patch|change/.test(normalized))
    return "Edit"
  if (/run|start|install|command|server|generate/.test(normalized)) return "Run"
  return "Inspect"
}

function normalizeStatus(value) {
  if (value === "failed") return "failed"
  if (value === "interrupted") return "interrupted"
  return "completed"
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(1, Math.round(milliseconds / 1000))
  if (totalSeconds < 60) return `${totalSeconds}s`

  const totalMinutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (totalMinutes < 60) {
    return seconds ? `${totalMinutes}m ${seconds}s` : `${totalMinutes}m`
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function makeActivitySummary(durationMs, actionCount, fileCount) {
  return `Worked for ${formatDuration(durationMs)} · ${pluralize(actionCount, "action")} · ${pluralize(fileCount, "file")}`
}

export function reviewMediaBlock(block, allowlist = REVIEWED_MEDIA) {
  if (!block || block.type !== "image") return null
  if (!ALLOWED_IMAGE_MIME_TYPES.has(block.mimeType)) {
    throw new Error(`Unsupported media type: ${String(block.mimeType)}`)
  }
  if (typeof block.data !== "string" || block.data.length > 14_000_000) {
    throw new Error("Invalid or oversized media payload")
  }

  const bytes = Buffer.from(block.data, "base64")
  if (!bytes.length || bytes.length > 10 * 1024 * 1024) {
    throw new Error("Invalid or oversized media payload")
  }

  const sourceHash = sha256(bytes)
  const metadata = allowlist[sourceHash]
  if (!metadata) return null

  return { bytes, metadata, sourceHash }
}

async function exportReviewedMedia(reviewed, mediaDirectory) {
  const image = sharp(reviewed.bytes, { failOn: "error" }).rotate()
  const sourceMetadata = await image.metadata()
  if (!sourceMetadata.width || !sourceMetadata.height) {
    throw new Error("Reviewed media has no dimensions")
  }

  const webp = await image.webp({ quality: 82, effort: 5 }).toBuffer()
  const outputHash = sha256(webp).slice(0, 16)
  const fileName = `${outputHash}.webp`
  await fs.writeFile(path.join(mediaDirectory, fileName), webp)

  return {
    type: "media",
    src: `${PUBLIC_BASE}/media/${fileName}`,
    width: sourceMetadata.width,
    height: sourceMetadata.height,
    alt: reviewed.metadata.alt,
    caption: reviewed.metadata.caption,
  }
}

async function loadExternalReviewedMedia(item) {
  const bytes = await fs.readFile(item.sourcePath)
  const sourceHash = sha256(bytes)
  if (sourceHash !== item.sourceHash) {
    throw new Error(
      `Reviewed media hash mismatch for ${path.basename(item.sourcePath)}`,
    )
  }

  return {
    bytes,
    sourceHash,
    metadata: {
      alt: item.alt,
      caption: item.caption,
    },
  }
}

function eventTime(record) {
  return parseTimestamp(record.timestamp, "event")
}

function validateSessionMetadata(records, descriptor) {
  const metadata = records.find(
    (record) => record.type === "session_meta",
  )?.payload
  if (!metadata)
    throw new Error(`Missing session metadata for ${descriptor.slug}`)
  if (metadata.id !== descriptor.id) {
    throw new Error(`Session ID mismatch for ${descriptor.slug}`)
  }
  if (metadata.thread_source !== "user") {
    throw new Error(`Refusing non-user session ${descriptor.slug}`)
  }
  if (metadata.cwd !== INVENTORY_ROOT) {
    throw new Error(`Unexpected project for ${descriptor.slug}`)
  }

  return metadata
}

export async function buildSession({
  descriptor,
  records,
  mediaDirectory,
  mediaAllowlist = REVIEWED_MEDIA,
  mediaExporter = exportReviewedMedia,
  externalMedia = [],
}) {
  const metadata = validateSessionMetadata(records, descriptor)
  const entries = []
  const seenMessageEvents = new Set()
  const pendingDetails = []
  const pendingMedia = []
  const pendingFiles = new Set()
  let pendingStatus = "completed"
  let pendingActionCount = 0
  let pendingExecDetail = null
  let pendingExecCount = 0
  let totalActionCount = 0
  let activityBoundaryMs = parseTimestamp(
    metadata.timestamp,
    "session metadata",
  )
  let lastActionMs = activityBoundaryMs
  let durationMs = 0

  const flushActivity = (endMs, forcedStatus) => {
    if (!pendingDetails.length && !pendingMedia.length) return

    const status = normalizeStatus(forcedStatus || pendingStatus)
    if (pendingDetails.length) {
      entries.push({
        type: "activity",
        summary: makeActivitySummary(
          Math.max(1_000, endMs - activityBoundaryMs),
          pendingActionCount,
          pendingFiles.size,
        ),
        status,
        details: pendingDetails.splice(0),
      })
    }
    entries.push(...pendingMedia.splice(0))
    pendingFiles.clear()
    pendingStatus = "completed"
    pendingActionCount = 0
    pendingExecDetail = null
    pendingExecCount = 0
    activityBoundaryMs = endMs
  }

  for (const record of records) {
    if (record.type === "response_item") {
      const item = record.payload
      if (item.type !== "custom_tool_call" && item.type !== "function_call")
        continue

      const timestamp = eventTime(record)
      const toolName = item.name
      if (toolName === "wait" || toolName === "write_stdin") continue

      if (toolName === "exec" || toolName === "exec_command") {
        pendingExecCount += 1
        pendingActionCount += 1
        totalActionCount += 1
        if (!pendingExecDetail) {
          pendingExecDetail = { category: "Run", label: "Ran 1 command" }
          pendingDetails.push(pendingExecDetail)
        } else {
          pendingExecDetail.label = `Ran ${pendingExecCount} commands`
        }
      } else if (toolName === "update_plan") {
        pendingDetails.push({ category: "Plan", label: "Updated the plan" })
        pendingActionCount += 1
        totalActionCount += 1
      } else if (toolName === "apply_patch") {
        pendingDetails.push({
          category: "Edit",
          label: "Applied project changes",
        })
        pendingActionCount += 1
        totalActionCount += 1
      } else {
        throw new Error(`Unsupported tool call: ${String(toolName)}`)
      }

      if (item.status === "failed") pendingStatus = "failed"
      lastActionMs = timestamp
      continue
    }

    if (record.type !== "event_msg") continue

    const event = record.payload
    const timestamp = eventTime(record)

    if (event.type === "task_started") {
      flushActivity(timestamp)
      activityBoundaryMs = timestamp
      continue
    }

    if (event.type === "task_complete") {
      flushActivity(timestamp)
      if (Number.isFinite(event.duration_ms) && event.duration_ms >= 0) {
        durationMs += event.duration_ms
      }
      activityBoundaryMs = timestamp
      continue
    }

    if (event.type === "turn_aborted") {
      pendingStatus = "interrupted"
      flushActivity(timestamp, "interrupted")
      if (Number.isFinite(event.duration_ms) && event.duration_ms >= 0) {
        durationMs += event.duration_ms
      }
      activityBoundaryMs = timestamp
      continue
    }

    if (event.type === "patch_apply_end") {
      const changes = event.changes
      if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
        throw new Error(`Invalid patch event in ${descriptor.slug}`)
      }

      let addedDetail = false
      for (const [filePath, change] of Object.entries(changes)) {
        const relativeFile = safeRelativeFile(filePath)
        if (!relativeFile) continue

        const changeType = change?.type
        const verb =
          changeType === "add"
            ? "Added"
            : changeType === "delete"
              ? "Deleted"
              : changeType === "move"
                ? "Moved"
                : "Updated"
        pendingDetails.push({
          category: "Edit",
          label: `${verb} ${relativeFile}`,
        })
        pendingFiles.add(relativeFile)
        pendingActionCount += 1
        totalActionCount += 1
        addedDetail = true
      }

      if (!addedDetail) {
        pendingDetails.push({
          category: "Edit",
          label: "Applied project changes",
        })
        pendingActionCount += 1
        totalActionCount += 1
      }
      if (event.success === false || event.status === "failed")
        pendingStatus = "failed"
      lastActionMs = timestamp
      continue
    }

    if (event.type === "mcp_tool_call_end") {
      const title = redactText(
        event.invocation?.arguments?.title || "Ran a tool",
      )
      assertPublicSafe(title, "activity title")
      pendingDetails.push({
        category: categorizeActivity(title),
        label: title || "Ran a tool",
      })
      pendingActionCount += 1
      totalActionCount += 1
      if (event.result && Object.hasOwn(event.result, "Err"))
        pendingStatus = "failed"

      const blocks = event.result?.Ok?.content
      if (blocks !== undefined && !Array.isArray(blocks)) {
        throw new Error(`Unsupported tool media result in ${descriptor.slug}`)
      }
      for (const block of blocks || []) {
        if (block?.type !== "image") continue
        const reviewed = reviewMediaBlock(block, mediaAllowlist)
        if (!reviewed) continue
        const media = await mediaExporter(reviewed, mediaDirectory)
        assertPublicSafe(media, "media entry")
        pendingMedia.push(media)
      }

      lastActionMs = timestamp + Math.max(0, Number(event.duration) || 0)
      continue
    }

    if (event.type === "user_message" || event.type === "agent_message") {
      if (
        event.type === "agent_message" &&
        !ALLOWED_AGENT_PHASES.has(event.phase)
      ) {
        throw new Error(`Unsupported agent phase: ${String(event.phase)}`)
      }

      const visibleText =
        event.type === "user_message"
          ? stripAmbientContext(event.message || "")
          : event.message || ""
      if (!visibleText.trim()) continue

      flushActivity(Math.max(timestamp, lastActionMs))
      const html = renderMarkdown(visibleText)
      if (!html) continue

      const role = event.type === "user_message" ? "user" : "assistant"
      const variant =
        event.type === "agent_message"
          ? event.phase === "final_answer"
            ? "final"
            : "progress"
          : undefined
      const messageKey = `${record.timestamp}\u0000${role}\u0000${variant || ""}\u0000${html}`
      if (seenMessageEvents.has(messageKey)) continue
      seenMessageEvents.add(messageKey)

      entries.push({
        type: "message",
        role,
        ...(variant ? { variant } : {}),
        html,
      })
      activityBoundaryMs = timestamp
      continue
    }
  }

  flushActivity(lastActionMs)

  for (const item of externalMedia) {
    const reviewed = await loadExternalReviewedMedia(item)
    const media = await mediaExporter(reviewed, mediaDirectory)
    assertPublicSafe(media, "media entry")
    entries.push(media)
  }

  if (!entries.length)
    throw new Error(`No visible entries for ${descriptor.slug}`)

  const session = {
    schemaVersion: SCHEMA_VERSION,
    slug: descriptor.slug,
    title: descriptor.title,
    entries,
  }
  assertPublicSafe(session, descriptor.slug)

  return {
    session,
    manifestEntry: {
      slug: descriptor.slug,
      title: descriptor.title,
      startedAt: new Date(
        parseTimestamp(metadata.timestamp, "session metadata"),
      ).toISOString(),
      durationMs: durationMs || null,
      messageCount: entries.filter((entry) => entry.type === "message").length,
      actionCount: totalActionCount,
      dataUrl: "",
    },
  }
}

async function walkJsonlFiles(directory) {
  const files = []
  const entries = await fs.readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walkJsonlFiles(absolutePath)))
    } else if (entry.isFile() && entry.name.endsWith(".jsonl")) {
      files.push(absolutePath)
    }
  }

  return files.sort((left, right) => left.localeCompare(right))
}

export async function discoverAllowlistedSessions(
  sourceDirectory,
  allowlist = SESSION_ALLOWLIST,
) {
  const files = await walkJsonlFiles(sourceDirectory)
  const result = new Map()

  for (const descriptor of allowlist) {
    const matches = files.filter((file) =>
      path.basename(file).includes(descriptor.id),
    )
    if (matches.length !== 1) {
      throw new Error(
        `Expected one JSONL for ${descriptor.slug}, found ${matches.length}`,
      )
    }
    result.set(descriptor.id, matches[0])
  }

  return result
}

async function resetGeneratedDirectory(outputDirectory) {
  await fs.mkdir(outputDirectory, { recursive: true })
  const sessionsDirectory = path.join(outputDirectory, "sessions")
  const mediaDirectory = path.join(outputDirectory, "media")
  await fs.mkdir(sessionsDirectory, { recursive: true })
  await fs.mkdir(mediaDirectory, { recursive: true })

  for (const directory of [sessionsDirectory, mediaDirectory]) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      if (!entry.isFile()) continue
      if (!/\.(?:json|webp)$/.test(entry.name)) continue
      await fs.unlink(path.join(directory, entry.name))
    }
  }

  return { mediaDirectory, sessionsDirectory }
}

function serializeJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

export function contentHashedSessionFileName(slug, sessionJson) {
  return `${slug}.${sha256(sessionJson).slice(0, 16)}.json`
}

export function assertSizeBudgets(manifestJson, sessionJsonBySlug) {
  if (Buffer.byteLength(manifestJson) >= MANIFEST_LIMIT_BYTES) {
    throw new Error("Agent session manifest exceeds 15 KiB")
  }

  for (const [slug, json] of sessionJsonBySlug) {
    if (Buffer.byteLength(json) >= SESSION_LIMIT_BYTES) {
      throw new Error(`${slug} exceeds 500 KiB uncompressed`)
    }
    if (gzipSync(json).byteLength >= SESSION_GZIP_LIMIT_BYTES) {
      throw new Error(`${slug} exceeds 150 KiB gzip`)
    }
  }
}

export async function exportAgentSessions({
  sourceDirectory = path.join(os.homedir(), ".codex", "sessions"),
  outputDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../static/resources/vibecoding-demo/agent-sessions",
  ),
} = {}) {
  const discovered = await discoverAllowlistedSessions(sourceDirectory)
  const { mediaDirectory, sessionsDirectory } =
    await resetGeneratedDirectory(outputDirectory)
  const manifestEntries = []
  const sessionJsonBySlug = new Map()

  for (const descriptor of SESSION_ALLOWLIST) {
    const sourceFile = discovered.get(descriptor.id)
    const source = await fs.readFile(sourceFile, "utf8")
    const records = parseJsonLines(source, path.basename(sourceFile))
    const { session, manifestEntry } = await buildSession({
      descriptor,
      records,
      mediaDirectory,
      externalMedia: EXTERNAL_REVIEWED_MEDIA[descriptor.slug] || [],
    })
    const sessionJson = serializeJson(session)
    assertPublicSafe(sessionJson, descriptor.slug)

    const fileName = contentHashedSessionFileName(descriptor.slug, sessionJson)
    await fs.writeFile(path.join(sessionsDirectory, fileName), sessionJson)
    manifestEntry.dataUrl = `${PUBLIC_BASE}/sessions/${fileName}`
    manifestEntries.push(manifestEntry)
    sessionJsonBySlug.set(descriptor.slug, sessionJson)
  }

  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    project: "Inventory",
    defaultSession: DEFAULT_SESSION,
    sessions: manifestEntries.sort(
      (left, right) => Date.parse(right.startedAt) - Date.parse(left.startedAt),
    ),
  }
  const manifestJson = serializeJson(manifest)
  assertPublicSafe(manifestJson, "manifest")
  assertSizeBudgets(manifestJson, sessionJsonBySlug)
  await fs.writeFile(path.join(outputDirectory, "index.json"), manifestJson)

  return { manifest, outputDirectory }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  exportAgentSessions()
    .then(({ manifest, outputDirectory }) => {
      process.stdout.write(
        `Exported ${manifest.sessions.length} sanitized Inventory sessions to ${outputDirectory}\n`,
      )
    })
    .catch((error) => {
      process.stderr.write(
        `${error instanceof Error ? error.message : String(error)}\n`,
      )
      process.exitCode = 1
    })
}

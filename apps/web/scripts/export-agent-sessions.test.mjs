import crypto from "node:crypto"
import os from "node:os"
import path from "node:path"

import { describe, expect, it } from "vite-plus/test"

import {
  MANIFEST_LIMIT_BYTES,
  SESSION_ALLOWLIST,
  SESSION_LIMIT_BYTES,
  assertPublicSafe,
  assertSizeBudgets,
  buildSession,
  contentHashedSessionFileName,
  makeActivitySummary,
  parseJsonLines,
  redactText,
  renderMarkdown,
  reviewMediaBlock,
} from "./export-agent-sessions.mjs"

const descriptor = SESSION_ALLOWLIST[0]
const inventoryRoot = path.join(os.homedir(), "Documents", "Inventory")

function record(timestamp, type, payload) {
  return { timestamp, type, payload }
}

function fixtureRecords() {
  const userMessage = record("2026-07-18T04:33:04.000Z", "event_msg", {
    type: "user_message",
    message: "Tolong cek perubahan ini.",
  })

  return [
    record("2026-07-18T04:33:03.722Z", "session_meta", {
      id: descriptor.id,
      timestamp: "2026-07-18T04:33:03.722Z",
      cwd: inventoryRoot,
      thread_source: "user",
    }),
    record("2026-07-18T04:33:03.800Z", "event_msg", {
      type: "task_started",
    }),
    userMessage,
    { ...userMessage },
    record("2026-07-18T04:33:05.000Z", "response_item", {
      type: "custom_tool_call",
      name: "exec",
      status: "completed",
    }),
    record("2026-07-18T04:33:06.000Z", "response_item", {
      type: "custom_tool_call_output",
    }),
    record("2026-07-18T04:33:07.000Z", "response_item", {
      type: "custom_tool_call",
      name: "exec",
      status: "completed",
    }),
    record("2026-07-18T04:33:08.000Z", "event_msg", {
      type: "patch_apply_end",
      status: "completed",
      success: true,
      changes: {
        [`${inventoryRoot}/src/app/page.tsx`]: { type: "update" },
        [`${inventoryRoot}/src/app/globals.css`]: { type: "update" },
      },
    }),
    record("2026-07-18T04:33:09.000Z", "event_msg", {
      type: "mcp_tool_call_end",
      invocation: { arguments: { title: "Verify production build" } },
      result: { Ok: {} },
    }),
    record("2026-07-18T04:33:10.000Z", "event_msg", {
      type: "agent_message",
      phase: "final_answer",
      message: "Selesai dan sudah diverifikasi.",
    }),
    record("2026-07-18T04:33:10.100Z", "event_msg", {
      type: "task_complete",
      duration_ms: 6_300,
    }),
  ]
}

describe("public transcript privacy", () => {
  it("redacts local, authentication, contact, network, and environment data", () => {
    const source = [
      "Open /Users/chrisandopramudhita/Documents/Inventory/src/app/page.tsx.",
      "Use http://localhost:3000/history?token=abc.",
      "Open https://example.com/oauth/authorize?client_id=private&state=private.",
      "Try http://192.168.1.8:3000/.",
      "Email person@example.com.",
      'DATABASE_URL="postgresql://user:password@example.com/db"',
      "[Preview](http://localhost:3000/inventory?secret=value)",
      "![QR](/private/tmp/inventory-qr.png)",
    ].join("\n")

    const redacted = redactText(source)
    expect(redacted).toContain("src/app/page.tsx")
    expect(redacted).toContain("local preview /history")
    expect(redacted).toContain("[private sign-in URL removed]")
    expect(redacted).toContain("[local network address]")
    expect(redacted).toContain("[email redacted]")
    expect(redacted).toContain("DATABASE_URL=[redacted]")
    expect(redacted).toContain("QR (image omitted)")
    expect(redacted).not.toContain("](local preview")
    expect(() => assertPublicSafe(redacted)).not.toThrow()
  })

  it("sanitizes raw HTML after rendering Markdown", () => {
    const html = renderMarkdown(
      "**Aman** <script>alert(1)</script> [bad](javascript:alert(1))",
    )

    expect(html).toContain("<strong>Aman</strong>")
    expect(html).not.toContain("<script")
    expect(html).not.toContain("javascript:")
  })

  it("keeps sanitized relative Markdown links balanced", () => {
    const html = renderMarkdown(
      `[setLoans](file://${inventoryRoot}/src/app/page.tsx:12)`,
    )

    expect(html).toBe("<p><span>setLoans</span></p>")
    expect(html.match(/<span>/g)).toHaveLength(1)
    expect(html.match(/<\/span>/g)).toHaveLength(1)
    expect(
      renderMarkdown(
        "[Preview](http://localhost:3000/inventory?token=private)",
      ),
    ).toBe("<p>local preview /inventory</p>")
  })

  it("fails closed if a dangerous value survives", () => {
    expect(() => assertPublicSafe("/Users/private/file.txt")).toThrow(
      /home-directory path/,
    )
    expect(() =>
      assertPublicSafe("https://example.com/page?access_token=secret"),
    ).toThrow(/URL query/)
  })
})

describe("event normalization", () => {
  it("rejects unsupported records and events", () => {
    expect(() => parseJsonLines('{"type":"mystery","payload":{}}')).toThrow(
      /Unsupported record type/,
    )
    expect(() =>
      parseJsonLines('{"type":"event_msg","payload":{"type":"mystery_event"}}'),
    ).toThrow(/Unsupported event/)
  })

  it("deduplicates messages and groups safe activity summaries", async () => {
    const { session, manifestEntry } = await buildSession({
      descriptor,
      records: fixtureRecords(),
      mediaDirectory: "/tmp/not-used",
    })

    const messages = session.entries.filter((entry) => entry.type === "message")
    const activity = session.entries.find((entry) => entry.type === "activity")
    expect(messages).toHaveLength(2)
    expect(activity.summary).toMatch(/^Worked for \d+s · 5 actions · 2 files$/)
    expect(activity.details).toContainEqual({
      category: "Run",
      label: "Ran 2 commands",
    })
    expect(activity.details).toContainEqual({
      category: "Verify",
      label: "Verify production build",
    })
    expect(
      activity.details.some((detail) => detail.label.includes("/Users/")),
    ).toBe(false)
    expect(manifestEntry.messageCount).toBe(2)
    expect(manifestEntry.actionCount).toBe(5)
  })

  it("produces deterministic content hashes", async () => {
    const first = await buildSession({
      descriptor,
      records: fixtureRecords(),
      mediaDirectory: "/tmp/not-used",
    })
    const second = await buildSession({
      descriptor,
      records: fixtureRecords(),
      mediaDirectory: "/tmp/not-used",
    })
    const firstJson = `${JSON.stringify(first.session, null, 2)}\n`
    const secondJson = `${JSON.stringify(second.session, null, 2)}\n`

    expect(firstJson).toBe(secondJson)
    expect(contentHashedSessionFileName(descriptor.slug, firstJson)).toBe(
      contentHashedSessionFileName(descriptor.slug, secondJson),
    )
  })
})

describe("media and size gates", () => {
  it("publishes only content-hash allowlisted media", () => {
    const bytes = Buffer.from("reviewed fixture")
    const sourceHash = crypto.createHash("sha256").update(bytes).digest("hex")
    const block = {
      type: "image",
      mimeType: "image/png",
      data: bytes.toString("base64"),
    }
    const allowlist = {
      [sourceHash]: { alt: "Reviewed fixture", caption: "Fixture" },
    }

    expect(reviewMediaBlock(block, allowlist)?.sourceHash).toBe(sourceHash)
    expect(reviewMediaBlock(block, {})).toBeNull()
    expect(() =>
      reviewMediaBlock({ ...block, mimeType: "image/svg+xml" }, allowlist),
    ).toThrow(/Unsupported media type/)
  })

  it("enforces manifest and transcript size budgets", () => {
    expect(() =>
      assertSizeBudgets("{}", new Map([["small", "{}"]])),
    ).not.toThrow()
    expect(() =>
      assertSizeBudgets("x".repeat(MANIFEST_LIMIT_BYTES), new Map()),
    ).toThrow(/manifest exceeds/)
    expect(() =>
      assertSizeBudgets(
        "{}",
        new Map([["large", "x".repeat(SESSION_LIMIT_BYTES)]]),
      ),
    ).toThrow(/uncompressed/)

    const incompressible = crypto.randomBytes(180 * 1024).toString("base64")
    expect(() =>
      assertSizeBudgets("{}", new Map([["gzip-large", incompressible]])),
    ).toThrow(/gzip/)
  })

  it("keeps the activity summary compact", () => {
    expect(makeActivitySummary(360_000, 12, 3)).toBe(
      "Worked for 6m · 12 actions · 3 files",
    )
  })
})

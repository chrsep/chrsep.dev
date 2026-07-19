import { describe, expect, it } from "vitest"
import { isSessionTranscript } from "./guards"

function transcriptWithHtml(html: string) {
  return {
    schemaVersion: 1,
    slug: "setup-inventory-tracking-app",
    title: "Setup inventory tracking app",
    entries: [
      {
        type: "message",
        role: "assistant",
        variant: "final",
        html,
      },
    ],
  }
}

describe("published transcript HTML", () => {
  it("accepts the offline renderer's balanced safe markup", () => {
    expect(
      isSessionTranscript(
        transcriptWithHtml(
          '<p>See <span>src/app/page.tsx</span> and <a href="https://example.com/" rel="nofollow noopener noreferrer">the preview</a>.</p>',
        ),
      ),
    ).toBe(true)
  })

  it.each([
    "<p><script>alert(1)</script></p>",
    '<p onclick="alert(1)">Unsafe</p>',
    '<a href="javascript:alert(1)" rel="nofollow noopener noreferrer">Unsafe</a>',
    "<p><code>Unbalanced</span></p>",
  ])("rejects corrupt or unsafe markup: %s", (html) => {
    expect(isSessionTranscript(transcriptWithHtml(html))).toBe(false)
  })
})

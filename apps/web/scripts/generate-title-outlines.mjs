// Converts the Vibe Coding deck's title lettering into SVG outlines.
//
// The deck (../../../vibecoding-workshop) sets its title in Fraunces 600, loaded
// from Google Fonts. The site self-hosts only Inter, and shipping a whole
// variable font for one decorative heading would cost more than the poster it
// draws — so the two words are baked into a path instead.
//
// Only `wght` is pinned. Fraunces also has opsz, SOFT and WONK axes, and the
// deck leaves all three alone: its stylesheet requests `Fraunces:ital,wght`, so
// Google serves the font with the unnamed axes fixed at their defaults (opsz=9,
// SOFT=0, WONK=1), and `font-optical-sizing: auto` has nothing to act on. Those
// are the upstream defaults too, so instancing weight alone reproduces the
// deck's letterforms exactly — including the wonky "n.alt" in "Coding". Setting
// opsz here to match the rendered pixel size would silently draw different
// glyphs.
//
// Writes the outline to src/lib/vibecoding/vibe-coding-title.json and mirrors it
// into the social card art, which needs the same glyphs and cannot rely on
// Fraunces being installed wherever the card is rasterized.

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import * as fontkit from "fontkit"

const TITLE = "Vibe Coding"
const WEIGHT = 600
// Matches the deck's `tracking-[-0.01em]` on h1 (style.css).
const LETTER_SPACING_EM = -0.01

const FONT_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces%5BSOFT%2CWONK%2Copsz%2Cwght%5D.ttf"

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const webDirectory = path.join(scriptDirectory, "..")
const outputFile = path.join(
  webDirectory,
  "src/lib/vibecoding/vibe-coding-title.json",
)
const socialCardFile = path.join(
  scriptDirectory,
  "assets/vibecoding-workshop-social.svg",
)

function roundPath(svg) {
  // Full precision is pointless at 2000 units per em and doubles the file size.
  return svg.replace(/-?\d+\.\d+/g, (value) =>
    String(Math.round(value * 10) / 10),
  )
}

const response = await fetch(FONT_URL)
if (!response.ok) {
  throw new Error(`Font download failed: ${response.status} ${response.url}`)
}

const font = fontkit
  .create(Buffer.from(await response.arrayBuffer()))
  .getVariation({ wght: WEIGHT })

const tracking = LETTER_SPACING_EM * font.unitsPerEm
const run = font.layout(TITLE)

const glyphPaths = []
let pen = 0
let minX = Infinity
let minY = Infinity
let maxX = -Infinity
let maxY = -Infinity

run.glyphs.forEach((glyph, index) => {
  // Font space is y-up, SVG is y-down.
  const placed = glyph.path.scale(1, -1).translate(pen, 0)

  // Whitespace glyphs have no contours and an infinite bbox — only advance.
  if (placed.commands.length > 0) {
    const box = placed.bbox
    glyphPaths.push(placed)
    minX = Math.min(minX, box.minX)
    minY = Math.min(minY, box.minY)
    maxX = Math.max(maxX, box.maxX)
    maxY = Math.max(maxY, box.maxY)
  }

  pen += run.positions[index].xAdvance + tracking
})

// Normalise so the tight bounding box starts at the origin; consumers then only
// need viewBox="0 0 width height" and can scale it however they like.
const d = glyphPaths
  .map((glyphPath) => roundPath(glyphPath.translate(-minX, -minY).toSVG()))
  .join(" ")

const outline = {
  text: TITLE,
  width: Math.round((maxX - minX) * 10) / 10,
  height: Math.round((maxY - minY) * 10) / 10,
  d,
}

await fs.writeFile(outputFile, `${JSON.stringify(outline, null, 2)}\n`)

// Keep the social card art in sync — it draws the same lettering and cannot
// depend on Fraunces being installed on the machine that rasterizes it.
const socialCard = await fs.readFile(socialCardFile, "utf8")
const titlePathPattern = /(<path\s+id="vibe-coding-title"[^>]*\sd=")[^"]*(")/
if (!titlePathPattern.test(socialCard)) {
  throw new Error(
    `No <path id="vibe-coding-title" d="..."> in ${path.basename(socialCardFile)}`,
  )
}
await fs.writeFile(
  socialCardFile,
  socialCard.replace(titlePathPattern, `$1${d}$2`),
)

console.log(
  `Generated "${TITLE}" outline — ${outline.width}×${outline.height} units, ${(d.length / 1024).toFixed(1)}KB\n` +
    `  wrote:  ${path.relative(webDirectory, outputFile)}\n` +
    `  synced: ${path.relative(webDirectory, socialCardFile)}`,
)

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const webDirectory = path.resolve(scriptDirectory, "..")
const staticDirectory = path.join(webDirectory, "static")
const sourceDirectory = path.join(scriptDirectory, "assets")

const faviconSource = path.join(staticDirectory, "favicon.svg")
const rasterIcons = [
  ["favicon-48.png", 48],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
]

const socialCards = [
  ["portfolio-social.svg", "portfolio.png"],
  ["vibecoding-workshop-social.svg", "vibecoding-workshop.png"],
]

await fs.mkdir(path.join(staticDirectory, "og"), { recursive: true })

for (const [fileName, size] of rasterIcons) {
  await sharp(faviconSource, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(staticDirectory, fileName))
}

for (const [sourceName, outputName] of socialCards) {
  await sharp(path.join(sourceDirectory, sourceName), { density: 144 })
    .resize(1200, 630)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(staticDirectory, "og", outputName))
}

console.log(
  `Generated ${rasterIcons.length} icons and ${socialCards.length} social cards in ${path.relative(process.cwd(), staticDirectory)}`,
)

import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { gzipSync } from "node:zlib"

import { parse } from "parse5"
import sharp from "sharp"

const SITE_ORIGIN = "https://www.chrsep.dev"
const ONE_MEGABYTE = 1024 * 1024

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const webDirectory = path.resolve(scriptDirectory, "..")
const outputDirectory = path.join(webDirectory, ".vercel", "output")
const staticOutputDirectory = path.join(outputDirectory, "static")

const pages = [
  {
    path: "/",
    output: "index.html",
    locale: "en",
    title: "Chrisando E. Pramudhita — Full-Stack Software Developer",
    description:
      "Full-stack software developer in South Tangerang, Indonesia, building fast, accessible websites and web apps for businesses.",
    en: "/",
    id: "/id",
    ogLocale: "en_US",
    ogAlternateLocale: "id_ID",
    image: "/og/portfolio.png",
    imageAlt:
      "Portfolio preview for Chrisando E. Pramudhita, full-stack software developer.",
    schemaTypes: ["WebSite", "WebPage", "Person"],
  },
  {
    path: "/id",
    output: "id.html",
    locale: "id",
    title: "Chrisando E. Pramudhita — Full-Stack Software Developer",
    description:
      "Full-stack software developer di Tangerang Selatan, Indonesia, membangun website dan aplikasi web cepat, aksesibel, dan ramah pengguna untuk bisnis.",
    en: "/",
    id: "/id",
    ogLocale: "id_ID",
    ogAlternateLocale: "en_US",
    image: "/og/portfolio.png",
    imageAlt:
      "Pratinjau portofolio Chrisando E. Pramudhita, full-stack software developer.",
    schemaTypes: ["WebPage"],
  },
  {
    path: "/about",
    output: "about.html",
    locale: "en",
    title: "About & Approach — Chrisando E. Pramudhita",
    description:
      "Learn about Chrisando’s background, product mindset, and practical approach to building fast, accessible websites and web apps.",
    en: "/about",
    id: "/id/about",
    ogLocale: "en_US",
    ogAlternateLocale: "id_ID",
    image: "/og/portfolio.png",
    imageAlt:
      "Portfolio preview for Chrisando E. Pramudhita, full-stack software developer.",
    schemaTypes: ["ProfilePage", "Person"],
  },
  {
    path: "/id/about",
    output: "id/about.html",
    locale: "id",
    title: "Profil dan Cara Kerja — Chrisando E. Pramudhita",
    description:
      "Kenali latar belakang, cara kerja, dan pendekatan praktis Chrisando dalam membangun website dan aplikasi web yang cepat dan aksesibel.",
    en: "/about",
    id: "/id/about",
    ogLocale: "id_ID",
    ogAlternateLocale: "en_US",
    image: "/og/portfolio.png",
    imageAlt:
      "Pratinjau portofolio Chrisando E. Pramudhita, full-stack software developer.",
    schemaTypes: ["ProfilePage", "Person"],
  },
  {
    path: "/cv",
    output: "cv.html",
    locale: "en",
    title: "CV & Experience — Chrisando E. Pramudhita",
    description:
      "Explore Chrisando E. Pramudhita’s full-stack software development experience, selected projects, education, and professional training.",
    en: "/cv",
    id: "/id/cv",
    ogLocale: "en_US",
    ogAlternateLocale: "id_ID",
    image: "/og/portfolio.png",
    imageAlt:
      "Portfolio preview for Chrisando E. Pramudhita, full-stack software developer.",
    schemaTypes: ["WebPage"],
  },
  {
    path: "/id/cv",
    output: "id/cv.html",
    locale: "id",
    title: "CV dan Pengalaman — Chrisando E. Pramudhita",
    description:
      "Lihat pengalaman Chrisando E. Pramudhita sebagai full-stack software developer, proyek pilihan, pendidikan, dan pelatihan profesionalnya.",
    en: "/cv",
    id: "/id/cv",
    ogLocale: "id_ID",
    ogAlternateLocale: "en_US",
    image: "/og/portfolio.png",
    imageAlt:
      "Pratinjau portofolio Chrisando E. Pramudhita, full-stack software developer.",
    schemaTypes: ["WebPage"],
  },
  {
    path: "/resources/vibecoding-demo",
    output: "resources/vibecoding-demo.html",
    locale: "en",
    title: "Vibe Coding Workshop Resources — Chrisando E. Pramudhita",
    description:
      "Explore Chrisando’s Vibe Coding workshop slides, live demo, AI agent chat transcripts, repositories, tools, and practical notes.",
    en: "/resources/vibecoding-demo",
    id: "/id/resources/vibecoding-demo",
    ogLocale: "en_US",
    ogAlternateLocale: "id_ID",
    image: "/og/vibecoding-workshop.png",
    imageAlt: "Vibe Coding workshop resources by Chrisando E. Pramudhita.",
    schemaTypes: [
      "CollectionPage",
      "LearningResource",
      "PresentationDigitalDocument",
    ],
  },
  {
    path: "/id/resources/vibecoding-demo",
    output: "id/resources/vibecoding-demo.html",
    locale: "id",
    title: "Materi Workshop Vibe Coding — Chrisando E. Pramudhita",
    description:
      "Jelajahi slide, demo langsung, transkrip AI agent, repositori, tools, dan catatan praktis dari workshop Vibe Coding oleh Chrisando.",
    en: "/resources/vibecoding-demo",
    id: "/id/resources/vibecoding-demo",
    ogLocale: "id_ID",
    ogAlternateLocale: "en_US",
    image: "/og/vibecoding-workshop.png",
    imageAlt: "Materi workshop Vibe Coding oleh Chrisando E. Pramudhita.",
    schemaTypes: [
      "CollectionPage",
      "LearningResource",
      "PresentationDigitalDocument",
    ],
  },
]

const rasterAssets = [
  { path: "/favicon-48.png", width: 48, height: 48 },
  { path: "/apple-touch-icon.png", width: 180, height: 180 },
  { path: "/icon-192.png", width: 192, height: 192 },
  { path: "/icon-512.png", width: 512, height: 512 },
  {
    path: "/og/portfolio.png",
    width: 1200,
    height: 630,
    maxBytes: ONE_MEGABYTE,
  },
  {
    path: "/og/vibecoding-workshop.png",
    width: 1200,
    height: 630,
    maxBytes: ONE_MEGABYTE,
  },
]

const redirectCases = [
  ["/vibe-coding", "/id/resources/vibecoding-demo"],
  ["/index.html", "/"],
  ["/en", "/"],
  ["/en/cv", "/cv"],
  ["/id/id/cv", "/id/cv"],
  ["/en/id/cv", "/id/cv"],
  ["/id/en/cv", "/cv"],
  ["/en/cv?ref=seo&lang=en", "/cv"],
  ["/cv/", "/cv"],
]

class Audit {
  checks = 0
  failures = []

  check(condition, message) {
    this.checks += 1
    if (!condition) this.failures.push(message)
  }

  equal(actual, expected, message) {
    this.checks += 1
    try {
      assert.deepEqual(actual, expected)
    } catch {
      this.failures.push(
        `${message} (expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)})`,
      )
    }
  }

  fail(message) {
    this.checks += 1
    this.failures.push(message)
  }

  finish(label) {
    if (this.failures.length > 0) {
      console.error(
        `SEO ${label} audit failed with ${this.failures.length} issue(s):`,
      )
      for (const [index, failure] of this.failures.entries()) {
        console.error(`${index + 1}. ${failure}`)
      }
      process.exitCode = 1
      return
    }

    console.log(`SEO ${label} audit passed (${this.checks} checks).`)
  }
}

function attribute(node, name) {
  return node?.attrs?.find((item) => item.name === name)?.value
}

function elements(root, tagName) {
  const matches = []

  function visit(node) {
    if (node.tagName === tagName) matches.push(node)
    for (const child of node.childNodes ?? []) visit(child)
  }

  visit(root)
  return matches
}

function firstElement(root, tagName) {
  return elements(root, tagName)[0]
}

function textContent(node) {
  if (!node) return ""
  if (node.nodeName === "#text") return node.value ?? ""
  return (node.childNodes ?? []).map(textContent).join("")
}

function normalizedText(node) {
  return textContent(node).replace(/\s+/g, " ").trim()
}

function metaNodes(document, key, attributeName = "name") {
  return elements(document, "meta").filter(
    (node) =>
      attribute(node, attributeName)?.toLowerCase() === key.toLowerCase(),
  )
}

function linkNodes(document, rel) {
  return elements(document, "link").filter((node) =>
    (attribute(node, "rel") ?? "")
      .toLowerCase()
      .split(/\s+/)
      .includes(rel.toLowerCase()),
  )
}

function contentValues(nodes) {
  return nodes.map((node) => attribute(node, "content"))
}

function absolute(pathname) {
  return new URL(pathname, SITE_ORIGIN).href
}

function schemaTypeSet(graph) {
  const types = new Set()
  for (const node of graph) {
    const values = Array.isArray(node?.["@type"])
      ? node["@type"]
      : [node?.["@type"]]
    for (const value of values) if (typeof value === "string") types.add(value)
  }
  return types
}

function validatePageHtml(audit, page, html, label) {
  let document
  try {
    document = parse(html)
  } catch (error) {
    audit.fail(`${label}: HTML could not be parsed: ${error.message}`)
    return
  }

  const htmlElement = firstElement(document, "html")
  const main = firstElement(document, "main")
  const titleNodes = elements(document, "title")
  const descriptionNodes = metaNodes(document, "description")
  const robotsNodes = metaNodes(document, "robots")
  const canonicalNodes = linkNodes(document, "canonical")
  const alternateNodes = linkNodes(document, "alternate").filter((node) =>
    Boolean(attribute(node, "hreflang")),
  )
  const canonicalUrl = absolute(page.path)

  audit.equal(
    attribute(htmlElement, "lang"),
    page.locale,
    `${label}: HTML language`,
  )
  audit.equal(titleNodes.length, 1, `${label}: title count`)
  audit.equal(normalizedText(titleNodes[0]), page.title, `${label}: title`)
  audit.equal(descriptionNodes.length, 1, `${label}: description count`)
  audit.equal(
    attribute(descriptionNodes[0], "content"),
    page.description,
    `${label}: description`,
  )
  audit.equal(robotsNodes.length, 1, `${label}: robots count`)
  audit.equal(
    attribute(robotsNodes[0], "content"),
    "max-image-preview:large",
    `${label}: robots directive`,
  )
  audit.equal(canonicalNodes.length, 1, `${label}: canonical count`)
  audit.equal(
    attribute(canonicalNodes[0], "href"),
    canonicalUrl,
    `${label}: canonical URL`,
  )

  const alternates = Object.fromEntries(
    alternateNodes.map((node) => [
      attribute(node, "hreflang"),
      attribute(node, "href"),
    ]),
  )
  audit.equal(alternateNodes.length, 3, `${label}: hreflang count`)
  audit.equal(
    alternates,
    {
      en: absolute(page.en),
      id: absolute(page.id),
      "x-default": absolute(page.en),
    },
    `${label}: hreflang URLs`,
  )

  const expectedOpenGraph = {
    "og:title": page.title,
    "og:description": page.description,
    "og:type": "website",
    "og:url": canonicalUrl,
    "og:site_name": "Chrisando E. Pramudhita",
    "og:locale": page.ogLocale,
    "og:locale:alternate": page.ogAlternateLocale,
    "og:image": absolute(page.image),
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": page.imageAlt,
  }

  for (const [property, expected] of Object.entries(expectedOpenGraph)) {
    const nodes = metaNodes(document, property, "property")
    audit.equal(nodes.length, 1, `${label}: ${property} count`)
    audit.equal(
      attribute(nodes[0], "content"),
      expected,
      `${label}: ${property}`,
    )
  }

  const expectedTwitter = {
    "twitter:card": "summary_large_image",
    "twitter:site": "@_chrsep",
    "twitter:creator": "@_chrsep",
    "twitter:title": page.title,
    "twitter:description": page.description,
    "twitter:image": absolute(page.image),
    "twitter:image:alt": page.imageAlt,
  }

  for (const [name, expected] of Object.entries(expectedTwitter)) {
    const nodes = metaNodes(document, name)
    audit.equal(nodes.length, 1, `${label}: ${name} count`)
    audit.equal(attribute(nodes[0], "content"), expected, `${label}: ${name}`)
  }

  audit.equal(
    metaNodes(document, "keywords").length,
    0,
    `${label}: no keywords meta`,
  )
  audit.equal(
    metaNodes(document, "googlebot").length,
    0,
    `${label}: no duplicate bot meta`,
  )
  audit.equal(
    metaNodes(document, "og:image:secure_url", "property").length,
    0,
    `${label}: no redundant secure image meta`,
  )
  audit.equal(
    main ? elements(main, "h1").length : 0,
    1,
    `${label}: main H1 count`,
  )

  const jsonLdNodes = elements(document, "script").filter(
    (node) => attribute(node, "type") === "application/ld+json",
  )
  audit.equal(jsonLdNodes.length, 1, `${label}: JSON-LD script count`)

  if (jsonLdNodes.length === 1) {
    try {
      const data = JSON.parse(textContent(jsonLdNodes[0]))
      audit.equal(
        data["@context"],
        "https://schema.org",
        `${label}: schema context`,
      )
      audit.check(
        Array.isArray(data["@graph"]),
        `${label}: schema graph is an array`,
      )

      if (Array.isArray(data["@graph"])) {
        const types = schemaTypeSet(data["@graph"])
        for (const type of page.schemaTypes) {
          audit.check(types.has(type), `${label}: schema includes ${type}`)
        }

        const webpage = data["@graph"].find(
          (node) => node?.["@id"] === `${canonicalUrl}#webpage`,
        )
        audit.check(
          Boolean(webpage),
          `${label}: schema has a stable webpage ID`,
        )
        if (webpage) {
          audit.equal(webpage.url, canonicalUrl, `${label}: schema page URL`)
          audit.equal(webpage.name, page.title, `${label}: schema page name`)
          audit.equal(
            webpage.description,
            page.description,
            `${label}: schema description`,
          )
          audit.equal(
            webpage.inLanguage,
            page.locale,
            `${label}: schema language`,
          )
        }
      }
    } catch (error) {
      audit.fail(`${label}: JSON-LD is not valid JSON: ${error.message}`)
    }
  }

  const charsetNodes = elements(document, "meta").filter((node) =>
    Boolean(attribute(node, "charset")),
  )
  audit.equal(charsetNodes.length, 1, `${label}: charset count`)
  audit.equal(
    attribute(charsetNodes[0], "charset"),
    "utf-8",
    `${label}: charset`,
  )
  audit.check(
    html.slice(0, 1024).toLowerCase().includes('<meta charset="utf-8"'),
    `${label}: charset is declared in the first 1024 bytes`,
  )
  audit.equal(
    contentValues(metaNodes(document, "viewport")),
    ["width=device-width, initial-scale=1"],
    `${label}: viewport`,
  )
  audit.equal(
    contentValues(metaNodes(document, "theme-color")),
    ["#181818"],
    `${label}: theme color`,
  )
  audit.equal(
    contentValues(metaNodes(document, "color-scheme")),
    ["dark"],
    `${label}: color scheme`,
  )

  const iconHrefs = linkNodes(document, "icon").map((node) =>
    attribute(node, "href"),
  )
  audit.equal(
    iconHrefs,
    ["/favicon.svg", "/favicon-48.png"],
    `${label}: favicons`,
  )
  audit.equal(
    linkNodes(document, "apple-touch-icon").map((node) =>
      attribute(node, "href"),
    ),
    ["/apple-touch-icon.png"],
    `${label}: Apple touch icon`,
  )
  audit.equal(
    linkNodes(document, "manifest").map((node) => attribute(node, "href")),
    ["/site.webmanifest"],
    `${label}: web manifest`,
  )
}

function validateSitemap(audit, xml, label) {
  const expectedUrls = pages.map((page) => absolute(page.path)).sort()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1])
    .sort()
  audit.equal(urls, expectedUrls, `${label}: canonical URL set`)

  const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
    (match) => match[1],
  )
  audit.equal(blocks.length, pages.length, `${label}: URL count`)

  for (const page of pages) {
    const canonicalUrl = absolute(page.path)
    const block = blocks.find((candidate) =>
      candidate.includes(`<loc>${canonicalUrl}</loc>`),
    )
    audit.check(Boolean(block), `${label}: entry exists for ${page.path}`)
    if (!block) continue

    const links = [...block.matchAll(/<xhtml:link\s+([^>]+?)\s*\/>/g)].map(
      (match) =>
        Object.fromEntries(
          [...match[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map((item) => [
            item[1],
            item[2],
          ]),
        ),
    )
    audit.equal(links.length, 3, `${label}: ${page.path} alternate count`)
    audit.equal(
      Object.fromEntries(links.map((link) => [link.hreflang, link.href])),
      {
        en: absolute(page.en),
        id: absolute(page.id),
        "x-default": absolute(page.en),
      },
      `${label}: ${page.path} alternates`,
    )
  }

  for (const unsupported of ["lastmod", "changefreq", "priority"]) {
    audit.check(
      !xml.includes(`<${unsupported}>`),
      `${label}: omits fabricated ${unsupported}`,
    )
  }
  for (const excluded of ["/studio", ".pdf", "/agent-sessions/", "/en/"]) {
    audit.check(!xml.includes(excluded), `${label}: excludes ${excluded}`)
  }
}

function validateRobots(audit, text, label) {
  audit.check(
    /^User-agent:\s*\*$/im.test(text),
    `${label}: applies to all crawlers`,
  )
  audit.check(
    !/^Disallow:\s*\/$/im.test(text),
    `${label}: does not block the site`,
  )
  audit.check(
    /^Sitemap:\s*https:\/\/www\.chrsep\.dev\/sitemap\.xml$/im.test(text),
    `${label}: advertises the canonical sitemap`,
  )
}

async function readText(filePath, audit, label) {
  try {
    return await fs.readFile(filePath, "utf8")
  } catch (error) {
    audit.fail(`${label}: cannot read ${filePath}: ${error.message}`)
    return null
  }
}

async function readJson(filePath, audit, label) {
  const text = await readText(filePath, audit, label)
  if (text === null) return null
  try {
    return JSON.parse(text)
  } catch (error) {
    audit.fail(`${label}: invalid JSON: ${error.message}`)
    return null
  }
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function listRelativeFiles(directory) {
  const files = []

  async function visit(currentDirectory) {
    for (const entry of await fs.readdir(currentDirectory, {
      withFileTypes: true,
    })) {
      const entryPath = path.join(currentDirectory, entry.name)
      if (entry.isDirectory()) {
        await visit(entryPath)
      } else if (entry.isFile()) {
        files.push(
          path.relative(directory, entryPath).split(path.sep).join("/"),
        )
      }
    }
  }

  await visit(directory)
  return files
}

async function validateRasterFile(audit, filePath, asset, label) {
  try {
    const [metadata, stats] = await Promise.all([
      sharp(filePath).metadata(),
      fs.stat(filePath),
    ])
    audit.equal(metadata.format, "png", `${label}: PNG format`)
    audit.equal(metadata.width, asset.width, `${label}: width`)
    audit.equal(metadata.height, asset.height, `${label}: height`)
    if (asset.maxBytes) {
      audit.check(stats.size < asset.maxBytes, `${label}: smaller than 1 MB`)
    }
  } catch (error) {
    audit.fail(`${label}: cannot inspect image: ${error.message}`)
  }
}

function findVercelRule(config, section, source) {
  return config?.[section]?.find((rule) => rule.source === source)
}

function ruleHasHeader(rule, key, value) {
  return rule?.headers?.some(
    (header) =>
      header.key?.toLowerCase() === key.toLowerCase() &&
      header.value?.toLowerCase().includes(value.toLowerCase()),
  )
}

async function validateStudioBuild(audit, vercelConfig) {
  const studioPath = path.join(staticOutputDirectory, "studio", "index.html")
  const html = await readText(studioPath, audit, "Studio build")
  if (html === null) return

  const document = parse(html)
  const robots = contentValues(metaNodes(document, "robots"))
  audit.check(
    robots.some((value) => value?.includes("noindex")),
    "Studio build: noindex",
  )

  const references = [
    ...linkNodes(document, "icon"),
    ...linkNodes(document, "apple-touch-icon"),
    ...linkNodes(document, "manifest"),
  ]

  for (const node of references) {
    const href = attribute(node, "href")
    const pathname = new URL(href, `${SITE_ORIGIN}/studio/`).pathname
    const directPath = path.join(
      staticOutputDirectory,
      pathname.replace(/^\//, ""),
    )
    let resolvedPath = directPath

    if (!(await exists(directPath))) {
      const rewrite = findVercelRule(vercelConfig, "rewrites", pathname)
      if (rewrite?.destination) {
        resolvedPath = path.join(
          staticOutputDirectory,
          rewrite.destination.replace(/^\//, ""),
        )
      }
    }

    audit.check(
      await exists(resolvedPath),
      `Studio build: ${href} resolves to an asset`,
    )
  }
}

async function validateInitialRouteJavaScript(audit) {
  const manifest = await readJson(
    path.join(
      webDirectory,
      ".svelte-kit",
      "output",
      "client",
      ".vite",
      "manifest.json",
    ),
    audit,
    "Client manifest",
  )
  if (!manifest) return

  const initialEntryNames = new Set([
    "entry/start",
    "entry/app",
    "nodes/0",
    "nodes/2",
  ])
  const visited = new Set()

  function visit(key) {
    if (visited.has(key) || !manifest[key]) return
    visited.add(key)
    for (const importedKey of manifest[key].imports ?? []) visit(importedKey)
  }

  for (const [key, entry] of Object.entries(manifest)) {
    if (entry.isEntry && initialEntryNames.has(entry.name)) visit(key)
  }

  let gzipBytes = 0
  for (const key of visited) {
    const file = manifest[key]?.file
    if (!file?.endsWith(".js")) continue
    const bytes = await fs.readFile(
      path.join(webDirectory, ".svelte-kit", "output", "client", file),
    )
    gzipBytes += gzipSync(bytes).length
  }

  audit.check(
    gzipBytes < 60 * 1024,
    `Client bundle: home route is below 60 KiB gzip (received ${(gzipBytes / 1024).toFixed(2)} KiB)`,
  )

  for (const [source, label] of [
    ["posthog-js/dist/module.js", "PostHog"],
    ["src/lib/globe.svelte", "globe"],
    [
      "src/lib/vibecoding/agent-sessions/agent-session-viewer.svelte",
      "transcript viewer",
    ],
  ]) {
    const entry = Object.entries(manifest).find(([key]) => key.includes(source))
    audit.check(
      Boolean(entry?.[1]?.isDynamicEntry),
      `Client bundle: ${label} is lazy`,
    )
    if (entry) {
      audit.check(
        !visited.has(entry[0]),
        `Client bundle: ${label} is excluded from initial home JavaScript`,
      )
    }
  }
}

async function runBuildAudit() {
  if (!(await exists(path.join(staticOutputDirectory, "index.html")))) {
    console.error(
      `SEO build output was not found at ${staticOutputDirectory}. Run pnpm build before pnpm --filter web test:seo.`,
    )
    process.exitCode = 2
    return
  }

  const audit = new Audit()

  const outputFiles = await listRelativeFiles(staticOutputDirectory)
  const pageHtmlFiles = outputFiles
    .filter((file) => file.endsWith(".html") && !file.startsWith("studio/"))
    .sort()
  audit.equal(
    pageHtmlFiles,
    pages.map((page) => page.output).sort(),
    "Build output: exactly eight intended page HTML files",
  )
  for (const unexpectedPath of [
    "en/index.html",
    "en.html",
    "id/sitemap.xml",
    "en/sitemap.xml",
  ]) {
    audit.check(
      !outputFiles.includes(unexpectedPath),
      `Build output: omits ${unexpectedPath}`,
    )
  }

  for (const page of pages) {
    const html = await readText(
      path.join(staticOutputDirectory, page.output),
      audit,
      `Build ${page.path}`,
    )
    if (html !== null) validatePageHtml(audit, page, html, `Build ${page.path}`)
  }

  await validateInitialRouteJavaScript(audit)

  for (const asset of rasterAssets) {
    await validateRasterFile(
      audit,
      path.join(staticOutputDirectory, asset.path.replace(/^\//, "")),
      asset,
      `Build asset ${asset.path}`,
    )
  }

  const faviconSvg = await readText(
    path.join(staticOutputDirectory, "favicon.svg"),
    audit,
    "Build favicon SVG",
  )
  if (faviconSvg !== null) {
    audit.check(
      /<svg\b/.test(faviconSvg),
      "Build favicon SVG: contains an SVG root",
    )
    audit.check(
      /viewBox="0 0 64 64"/.test(faviconSvg),
      "Build favicon SVG: stable square viewBox",
    )
  }

  const manifest = await readJson(
    path.join(staticOutputDirectory, "site.webmanifest"),
    audit,
    "Build manifest",
  )
  if (manifest) {
    audit.equal(
      manifest.display,
      "browser",
      "Build manifest: browser display mode",
    )
    audit.equal(manifest.theme_color, "#181818", "Build manifest: theme color")
    audit.equal(
      manifest.icons?.map(({ src, sizes, type }) => ({ src, sizes, type })),
      [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      "Build manifest: icon contract",
    )
  }

  const sitemap = await readText(
    path.join(staticOutputDirectory, "sitemap.xml"),
    audit,
    "Build sitemap",
  )
  if (sitemap !== null) validateSitemap(audit, sitemap, "Build sitemap")

  const robots = await readText(
    path.join(staticOutputDirectory, "robots.txt"),
    audit,
    "Build robots.txt",
  )
  if (robots !== null) validateRobots(audit, robots, "Build robots.txt")

  const vercelConfig = await readJson(
    path.join(webDirectory, "vercel.json"),
    audit,
    "Vercel source config",
  )
  if (vercelConfig) {
    audit.check(
      ruleHasHeader(
        findVercelRule(
          vercelConfig,
          "headers",
          "/resources/vibecoding-workshop.pdf",
        ),
        "X-Robots-Tag",
        "noindex",
      ),
      "Vercel config: PDF has X-Robots-Tag noindex",
    )
    audit.check(
      ruleHasHeader(
        findVercelRule(
          vercelConfig,
          "headers",
          "/resources/vibecoding-demo/agent-sessions/(.*)",
        ),
        "X-Robots-Tag",
        "noindex",
      ),
      "Vercel config: transcript data has X-Robots-Tag noindex",
    )
    audit.check(
      ruleHasHeader(
        findVercelRule(vercelConfig, "headers", "/studio/(.*)"),
        "X-Robots-Tag",
        "noindex, nofollow",
      ),
      "Vercel config: Studio descendants have X-Robots-Tag noindex, nofollow",
    )
    for (const [source, destination] of [
      ["/static/favicon.ico", "/studio/static/favicon.ico"],
      ["/static/favicon.svg", "/studio/static/favicon.svg"],
      ["/static/apple-touch-icon.png", "/studio/static/apple-touch-icon.png"],
      ["/static/manifest.webmanifest", "/studio/static/manifest.webmanifest"],
    ]) {
      audit.equal(
        findVercelRule(vercelConfig, "rewrites", source)?.destination,
        destination,
        `Vercel config: ${source} Studio compatibility rewrite`,
      )
    }
    await validateStudioBuild(audit, vercelConfig)
  }

  const adapterConfig = await readJson(
    path.join(outputDirectory, "config.json"),
    audit,
    "Vercel output config",
  )
  if (adapterConfig) {
    audit.equal(
      adapterConfig.version,
      3,
      "Vercel output config: Build Output API version",
    )
    for (const page of pages.filter((candidate) => candidate.path !== "/")) {
      const trailingSlashRule = adapterConfig.routes?.find(
        (route) => route.src === `${page.path}/` && route.status === 308,
      )
      audit.equal(
        trailingSlashRule?.headers?.Location,
        page.path,
        `Vercel output config: ${page.path}/ permanently normalizes`,
      )
    }
    audit.equal(
      Object.keys(adapterConfig.overrides ?? {}).sort(),
      pages.map((page) => page.output).sort(),
      "Vercel output config: physical HTML overrides match canonical pages",
    )
  }

  audit.finish("build")
}

async function fetchResponse(url, options = {}) {
  return fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      "user-agent": "chrsep.dev SEO audit",
      ...options.headers,
    },
    signal: AbortSignal.timeout(20_000),
  })
}

async function fetchForAudit(audit, url, label, options = {}) {
  try {
    return await fetchResponse(url, options)
  } catch (error) {
    audit.fail(`${label}: request failed: ${error.message}`)
    return null
  }
}

async function validateLiveRaster(audit, baseUrl, asset) {
  const url = new URL(asset.path, baseUrl)
  const response = await fetchForAudit(audit, url, `Live asset ${asset.path}`)
  if (!response) return

  audit.equal(response.status, 200, `Live asset ${asset.path}: status`)
  audit.check(
    response.headers.get("content-type")?.includes("image/png"),
    `Live asset ${asset.path}: PNG content type`,
  )

  try {
    const bytes = Buffer.from(await response.arrayBuffer())
    const metadata = await sharp(bytes).metadata()
    audit.equal(metadata.width, asset.width, `Live asset ${asset.path}: width`)
    audit.equal(
      metadata.height,
      asset.height,
      `Live asset ${asset.path}: height`,
    )
    if (asset.maxBytes) {
      audit.check(
        bytes.length < asset.maxBytes,
        `Live asset ${asset.path}: smaller than 1 MB`,
      )
    }
  } catch (error) {
    audit.fail(
      `Live asset ${asset.path}: cannot inspect image: ${error.message}`,
    )
  }
}

async function validateLiveStudio(audit, baseUrl) {
  const response = await fetchForAudit(
    audit,
    new URL("/studio", baseUrl),
    "Live Studio",
  )
  if (!response) return
  audit.equal(response.status, 200, "Live Studio: status")
  const robotsHeader = response.headers.get("x-robots-tag")?.toLowerCase()
  audit.check(robotsHeader?.includes("noindex"), "Live Studio: header noindex")
  audit.check(
    robotsHeader?.includes("nofollow"),
    "Live Studio: header nofollow",
  )

  const html = await response.text()
  const document = parse(html)
  audit.check(
    contentValues(metaNodes(document, "robots")).some((value) =>
      value?.includes("noindex"),
    ),
    "Live Studio: noindex meta",
  )

  const references = [
    ...linkNodes(document, "icon"),
    ...linkNodes(document, "apple-touch-icon"),
    ...linkNodes(document, "manifest"),
  ]
  for (const node of references) {
    const href = attribute(node, "href")
    const assetResponse = await fetchForAudit(
      audit,
      new URL(href, new URL("/studio/", baseUrl)),
      `Live Studio asset ${href}`,
    )
    if (assetResponse) {
      audit.equal(
        assetResponse.status,
        200,
        `Live Studio asset ${href}: status`,
      )
      const pathname = new URL(href, new URL("/studio/", baseUrl)).pathname
      const expectedType = pathname.endsWith(".svg")
        ? "image/svg+xml"
        : pathname.endsWith(".png")
          ? "image/png"
          : pathname.endsWith(".ico")
            ? "image/"
            : pathname.endsWith(".webmanifest")
              ? "application/manifest+json"
              : null
      if (expectedType) {
        audit.check(
          assetResponse.headers.get("content-type")?.includes(expectedType),
          `Live Studio asset ${href}: content type`,
        )
      }
    }
  }
}

async function validateNoindexHeader(audit, baseUrl, pathname, label) {
  let response = await fetchForAudit(audit, new URL(pathname, baseUrl), label, {
    method: "HEAD",
    redirect: "manual",
  })
  if (response?.status === 405) {
    response = await fetchForAudit(audit, new URL(pathname, baseUrl), label, {
      headers: { range: "bytes=0-0" },
      redirect: "manual",
    })
  }
  if (!response) return

  audit.check(
    response.status >= 200 && response.status < 400,
    `${label}: successful status`,
  )
  audit.check(
    response.headers.get("x-robots-tag")?.toLowerCase().includes("noindex"),
    `${label}: X-Robots-Tag noindex`,
  )
}

async function runLiveAudit() {
  const configuredBaseUrl = process.env.SEO_BASE_URL
  if (!configuredBaseUrl) {
    console.error(
      "SEO_BASE_URL is required. Example: SEO_BASE_URL=https://www.chrsep.dev pnpm --filter web test:seo:live",
    )
    process.exitCode = 2
    return
  }

  let baseUrl
  try {
    baseUrl = new URL(configuredBaseUrl)
    if (!["http:", "https:"].includes(baseUrl.protocol))
      throw new Error("use HTTP or HTTPS")
    baseUrl.pathname = "/"
    baseUrl.search = ""
    baseUrl.hash = ""
  } catch (error) {
    console.error(`Invalid SEO_BASE_URL: ${error.message}`)
    process.exitCode = 2
    return
  }

  const audit = new Audit()

  await Promise.all(
    pages.map(async (page) => {
      const response = await fetchForAudit(
        audit,
        new URL(page.path, baseUrl),
        `Live ${page.path}`,
      )
      if (!response) return
      audit.equal(response.status, 200, `Live ${page.path}: status`)
      validatePageHtml(audit, page, await response.text(), `Live ${page.path}`)
    }),
  )

  await Promise.all(
    rasterAssets.map((asset) => validateLiveRaster(audit, baseUrl, asset)),
  )

  for (const assetPath of ["/favicon.svg", "/site.webmanifest"]) {
    const response = await fetchForAudit(
      audit,
      new URL(assetPath, baseUrl),
      `Live asset ${assetPath}`,
    )
    if (response) {
      audit.equal(response.status, 200, `Live asset ${assetPath}: status`)
      audit.check(
        response.headers
          .get("content-type")
          ?.includes(
            assetPath.endsWith(".svg")
              ? "image/svg+xml"
              : "application/manifest+json",
          ),
        `Live asset ${assetPath}: content type`,
      )
    }
  }

  const sitemapResponse = await fetchForAudit(
    audit,
    new URL("/sitemap.xml", baseUrl),
    "Live sitemap",
  )
  if (sitemapResponse) {
    audit.equal(sitemapResponse.status, 200, "Live sitemap: status")
    audit.check(
      sitemapResponse.headers.get("content-type")?.includes("xml"),
      "Live sitemap: XML content type",
    )
    validateSitemap(audit, await sitemapResponse.text(), "Live sitemap")
  }

  const robotsResponse = await fetchForAudit(
    audit,
    new URL("/robots.txt", baseUrl),
    "Live robots.txt",
  )
  if (robotsResponse) {
    audit.equal(robotsResponse.status, 200, "Live robots.txt: status")
    validateRobots(audit, await robotsResponse.text(), "Live robots.txt")
  }

  for (const [source, destination] of redirectCases) {
    const sourceUrl = new URL(source, baseUrl)
    const response = await fetchForAudit(
      audit,
      sourceUrl,
      `Live redirect ${source}`,
      { redirect: "manual" },
    )
    if (!response) continue
    audit.equal(response.status, 308, `Live redirect ${source}: status`)
    const location = response.headers.get("location")
    audit.check(Boolean(location), `Live redirect ${source}: Location header`)
    if (location) {
      audit.equal(
        new URL(location, baseUrl).pathname,
        destination,
        `Live redirect ${source}: destination`,
      )
      audit.equal(
        new URL(location, baseUrl).search,
        sourceUrl.search,
        `Live redirect ${source}: query string`,
      )
    }
  }

  for (const physicalPath of ["/about.html", "/cv.html", "/id.html"]) {
    const response = await fetchForAudit(
      audit,
      new URL(physicalPath, baseUrl),
      `Live physical path ${physicalPath}`,
      { redirect: "manual" },
    )
    if (response) {
      audit.equal(
        response.status,
        404,
        `Live physical path ${physicalPath}: not publicly exposed`,
      )
    }
  }

  const missingResponse = await fetchForAudit(
    audit,
    new URL("/__seo-audit-missing-page__", baseUrl),
    "Live missing page",
    { redirect: "manual" },
  )
  if (missingResponse) {
    audit.equal(missingResponse.status, 404, "Live missing page: status")
    const document = parse(await missingResponse.text())
    audit.check(
      contentValues(metaNodes(document, "robots")).some((value) =>
        value?.includes("noindex"),
      ),
      "Live missing page: noindex",
    )
    audit.equal(
      linkNodes(document, "canonical").length,
      0,
      "Live missing page: no canonical",
    )
    audit.equal(
      linkNodes(document, "alternate").filter((node) =>
        attribute(node, "hreflang"),
      ).length,
      0,
      "Live missing page: no hreflang",
    )
    audit.equal(
      metaNodes(document, "og:title", "property").length,
      0,
      "Live missing page: no Open Graph metadata",
    )
    audit.equal(
      metaNodes(document, "twitter:card").length,
      0,
      "Live missing page: no Twitter metadata",
    )
    audit.equal(
      elements(document, "script").filter(
        (node) => attribute(node, "type") === "application/ld+json",
      ).length,
      0,
      "Live missing page: no JSON-LD",
    )
  }

  await validateNoindexHeader(
    audit,
    baseUrl,
    "/resources/vibecoding-workshop.pdf",
    "Live workshop PDF",
  )
  await validateNoindexHeader(
    audit,
    baseUrl,
    "/resources/vibecoding-demo/agent-sessions/index.json",
    "Live transcript manifest",
  )
  await validateLiveStudio(audit, baseUrl)

  if (baseUrl.hostname === "www.chrsep.dev") {
    const apexResponse = await fetchForAudit(
      audit,
      "https://chrsep.dev/",
      "Live apex redirect",
      { redirect: "manual" },
    )
    if (apexResponse) {
      audit.equal(apexResponse.status, 308, "Live apex redirect: status")
      audit.equal(
        apexResponse.headers.get("location"),
        `${SITE_ORIGIN}/`,
        "Live apex redirect: destination",
      )
    }
  }

  audit.finish("live")
}

function printHelp() {
  console.log(`Usage:
  pnpm --filter web test:seo
      Validate the completed Vercel build in apps/web/.vercel/output.

  SEO_BASE_URL=https://www.chrsep.dev pnpm --filter web test:seo:live
      Validate a deployed preview or production site, including redirects and headers.

  node ./scripts/seo-audit.mjs --help
      Show this help.`)
}

const mode = process.argv[2]

if (mode === "build") {
  await runBuildAudit()
} else if (mode === "live") {
  await runLiveAudit()
} else if (mode === "--help" || mode === "help" || mode === undefined) {
  printHelp()
} else {
  console.error(`Unknown SEO audit mode: ${mode}`)
  printHelp()
  process.exitCode = 2
}

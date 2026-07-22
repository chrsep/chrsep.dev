# SEO audit and implementation report

- Date: 2026-07-22
- Canonical origin: `https://www.chrsep.dev`
- Audience: clients and recruiters
- Positioning: Full-Stack Software Developer

## Executive summary

The new local production build now has a complete, page-owned SEO contract for all eight English and Indonesian portfolio routes. The deterministic build audit passes 670 checks, all unit tests and Svelte diagnostics pass, and the final mobile Lighthouse run scores 95 Performance, 100 Accessibility, and 100 SEO.

The public production site has not been deployed from this worktree yet. A direct audit of `https://www.chrsep.dev` on 2026-07-22 produced 462 failed assertions against the new contract. Those are failed checks rather than 462 unique defects; they primarily show that production still serves the previous metadata, routing, assets, and crawler configuration. Deployment and the post-deployment live audit remain required.

## Framework validation

The implementation follows the current official SvelteKit guidance resolved through Context7 as `/sveltejs/kit`:

- [SEO best practices](https://github.com/sveltejs/kit/blob/version-3/documentation/docs/40-best-practices/20-seo.md): unique titles and descriptions rendered through `<svelte:head>`, with searchable content server-rendered or prerendered.
- [Accessibility and route announcements](https://github.com/sveltejs/kit/blob/version-3/documentation/docs/40-best-practices/10-accessibility.md): a unique page title is also required for useful client-navigation announcements.
- [Page options and prerendering](https://github.com/sveltejs/kit/blob/version-3/documentation/docs/20-core-concepts/40-page-options.md): static pages and endpoints can explicitly opt into prerendering.

The selected APIs were checked against the installed SvelteKit 2.60.1 and Svelte 5.55.9 packages. Metadata remains declarative and page-owned; no imperative `document.title` or manual head mutation is used.

## Route-by-route result

All eight routes prerender as 200 pages, contain one main H1, use the correct document language, and emit one complete metadata and JSON-LD graph. English is the `x-default` locale.

| Route                           | Language   | Exact title                                              | Exact description                                                                                                                                    | Canonical                                             | Schema page type                                      |
| ------------------------------- | ---------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| `/`                             | English    | Chrisando E. Pramudhita — Full-Stack Software Developer  | Full-stack software developer in South Tangerang, Indonesia, building fast, accessible websites and web apps for businesses.                         | `https://www.chrsep.dev/`                             | `WebPage` plus `WebSite` and `Person`                 |
| `/id`                           | Indonesian | Chrisando E. Pramudhita — Full-Stack Software Developer  | Full-stack software developer di Tangerang Selatan, Indonesia, membangun website dan aplikasi web cepat, aksesibel, dan ramah pengguna untuk bisnis. | `https://www.chrsep.dev/id`                           | `WebPage` referencing the same `WebSite` and `Person` |
| `/about`                        | English    | About & Approach — Chrisando E. Pramudhita               | Learn about Chrisando’s background, product mindset, and practical approach to building fast, accessible websites and web apps.                      | `https://www.chrsep.dev/about`                        | `ProfilePage` with `Person` as `mainEntity`           |
| `/id/about`                     | Indonesian | Profil dan Cara Kerja — Chrisando E. Pramudhita          | Kenali latar belakang, cara kerja, dan pendekatan praktis Chrisando dalam membangun website dan aplikasi web yang cepat dan aksesibel.               | `https://www.chrsep.dev/id/about`                     | `ProfilePage` with `Person` as `mainEntity`           |
| `/cv`                           | English    | CV & Experience — Chrisando E. Pramudhita                | Explore Chrisando E. Pramudhita’s full-stack software development experience, selected projects, education, and professional training.               | `https://www.chrsep.dev/cv`                           | `WebPage` about the `Person`                          |
| `/id/cv`                        | Indonesian | CV dan Pengalaman — Chrisando E. Pramudhita              | Lihat pengalaman Chrisando E. Pramudhita sebagai full-stack software developer, proyek pilihan, pendidikan, dan pelatihan profesionalnya.            | `https://www.chrsep.dev/id/cv`                        | `WebPage` about the `Person`                          |
| `/resources/vibecoding-demo`    | English    | Vibe Coding Workshop Resources — Chrisando E. Pramudhita | Explore Chrisando’s Vibe Coding workshop slides, live demo, AI agent chat transcripts, repositories, tools, and practical notes.                     | `https://www.chrsep.dev/resources/vibecoding-demo`    | `CollectionPage` with `LearningResource`              |
| `/id/resources/vibecoding-demo` | Indonesian | Materi Workshop Vibe Coding — Chrisando E. Pramudhita    | Jelajahi slide, demo langsung, transkrip AI agent, repositori, tools, dan catatan praktis dari workshop Vibe Coding oleh Chrisando.                  | `https://www.chrsep.dev/id/resources/vibecoding-demo` | `CollectionPage` with `LearningResource`              |

The titles and descriptions live in the existing Paraglide English and Indonesian message files, so visible page copy and metadata share the same locale source.

## Head contract

Each indexable leaf page now emits exactly one of each required item:

- Unique title and meta description.
- `robots` with `max-image-preview:large`.
- Absolute self-canonical.
- Reciprocal `en`, `id`, and `x-default` alternates.
- Complete Open Graph website metadata, including locale, alternate locale, 1200×630 image, dimensions, type, and localized alt text.
- Complete X card metadata using `@_chrsep` for both site and creator.
- Safely serialized JSON-LD.

The application shell keeps only browser-level metadata: charset first, viewport, theme color, color scheme, favicon links, Apple touch icon, and the web manifest. Canonicals and alternates were removed from the root layout so errors and blank responses cannot inherit indexable metadata.

Unknown routes preserve a real 404 response and render localized `noindex` metadata without canonical, alternate, Open Graph, X, or JSON-LD tags. Catastrophic failures use the generic `src/error.html` fallback with `noindex`.

## Structured data

The graph uses stable identifiers:

- `https://www.chrsep.dev/#website`
- `https://www.chrsep.dev/#person`
- `${canonical}#webpage`
- `${workshopCanonical}#learning-resource`

Person data is limited to visible and verified facts: full name, known alternate names, professional title, South Tangerang location, and existing GitHub, LinkedIn, X, and Stack Overflow profiles. No portrait, rating, employer, service, credential, date, or interaction data was invented. Workshop graphs include the linked PDF as a `PresentationDigitalDocument`.

The build audit parses every graph and verifies its page mapping, IDs, canonical references, and language. External rich-result validation should be repeated against the deployed URLs because local structural validity does not guarantee that a search engine will display a rich result.

## Sitemap, robots, and routing

`/sitemap.xml` is a prerendered SvelteKit endpoint generated from the same canonical route registry as page metadata. It contains exactly the eight URLs above and reciprocal XML alternates for English, Indonesian, and `x-default`. It deliberately omits fabricated freshness, priority, and change-frequency values.

`robots.txt` allows crawling and advertises `https://www.chrsep.dev/sitemap.xml`. Paraglide excludes the sitemap, robots file, Studio, workshop PDF, and agent-session data/media from localization.

Routing now enforces:

- `trailingSlash = "never"`, relying on adapter-generated 308 normalization.
- One-hop permanent locale alias normalization, with the last leading locale winning and query strings preserved.
- `/en/cv` → `/cv`, `/id/id/cv` → `/id/cv`, `/en/id/cv` → `/id/cv`, and `/id/en/cv` → `/cv`.
- No normalization of Studio, sitemap, robots, PDF, or transcript resources.
- Permanent `/vibe-coding` and `/index.html` redirects.
- No public physical route forms such as `/about.html`.

The apex-to-www rule remains a Vercel domain configuration concern and must be rechecked after deployment.

## Non-page resources and Studio

Vercel configuration adds the required crawler headers:

- Workshop PDF: `X-Robots-Tag: noindex`.
- Agent-session data and media: `X-Robots-Tag: noindex`.
- Studio and descendants: `X-Robots-Tag: noindex, nofollow`.

Targeted rewrites resolve Sanity's generated root `/static/...` favicon and manifest references to `/studio/static/...` without editing generated Studio output.

## Social and browser assets

- `/og/portfolio.png`: 1200×630, approximately 126 KB.
- `/og/vibecoding-workshop.png`: 1200×630, approximately 136 KB.
- Vector monogram favicon master plus 48, 180, 192, and 512-pixel PNG exports.
- Minimal dark-theme web manifest with 192 and 512-pixel icons.

The prior 24×24 photographic favicon was removed rather than enlarged. Asset generation is reproducible through `pnpm --filter web generate:seo-assets` and uses the existing Sharp dependency.

## On-page, accessibility, and performance work

- About now has substantive localized content instead of an indexable empty page.
- Localized navigation exposes Home, About, CV, and workshop resources as crawlable links.
- Every page has one main H1; the footer heading is an H2.
- A skip link, visible focus states, accessible icon names, 44-pixel controls, stronger contrast, reduced-motion handling, and fixed image dimensions were added.
- PostHog loads through an idle dynamic import while retaining the initial page-view event.
- The globe loads only on desktop, the transcript viewer is lazy, and the workshop preview is crawlable before its iframe is loaded on demand.
- The Latin Inter font is preloaded and the LCP-delaying hero entrance fade was removed.
- Initial home-route JavaScript is 52.85 KiB gzip. PostHog, the globe, and transcript viewer are excluded from that initial closure.

Final local mobile Lighthouse snapshot:

| Metric                   | Result |              Target | Status         |
| ------------------------ | -----: | ------------------: | -------------- |
| Performance              |     95 |                 ≥95 | Met            |
| Accessibility            |    100 |                 ≥95 | Met            |
| SEO                      |    100 |                 ≥95 | Met            |
| First Contentful Paint   |  1.7 s | Recorded, not gated | Recorded       |
| Largest Contentful Paint |  2.4 s |              ≤2.5 s | Met in lab run |
| Cumulative Layout Shift  |      0 |                ≤0.1 | Met            |
| Total Blocking Time      |   0 ms | Recorded, not gated | Recorded       |

Lighthouse is a lab snapshot and can vary between runs. The Core Web Vitals goals still need field validation at p75 after sufficient production traffic: LCP ≤2.5 s, CLS ≤0.1, and INP ≤200 ms.

## Verification record

| Check                              | Result                                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm exec turbo ls`               | Passed; exactly `web`, `studio`, and `cv` once each                                          |
| `pnpm --filter web check`          | Passed; 0 errors and 0 warnings                                                              |
| `pnpm --filter web test`           | Passed; 3 files and 54 tests                                                                 |
| `pnpm build`                       | Passed                                                                                       |
| `pnpm --filter web test:seo`       | Passed; 670 deterministic checks                                                             |
| Rendered desktop/mobile QA         | Passed for Home, About EN/ID, CV metadata, workshop preview, and 404 behavior                |
| Client navigation head replacement | Passed; no accumulated titles, descriptions, canonicals, alternates, social tags, or JSON-LD |
| Alias query preservation           | Passed locally; `/en/cv?ref=seo&lang=en` returns one 308 to `/cv?ref=seo&lang=en`            |

## Direct production baseline before deployment

The live audit of `https://www.chrsep.dev` confirmed that production currently serves the old implementation:

- `/sitemap.xml` returns 404 and `robots.txt` does not advertise a sitemap.
- About routes return 200 but lack substantive page content, a title, and a main H1.
- Existing canonicals use the non-www origin and pages lack the new reciprocal alternates.
- Titles and descriptions do not match the approved localized copy.
- Complete Open Graph, X, robots, and JSON-LD contracts are absent.
- Locale aliases can resolve as duplicate 200 pages instead of a single 308.
- Unknown 404 pages inherit indexable canonical and alternate metadata.
- New social images and icon assets return 404.
- PDF, transcript, and Studio crawler headers and Studio asset rewrites are not active.

The existing apex-to-www redirect, `/vibe-coding` redirect, trailing-slash handling, and rejection of physical `.html` route forms were already behaving correctly in the live checks.

## Deployment and monitoring checklist

1. Review and deploy this worktree through the normal Vercel workflow.
2. Run `SEO_BASE_URL=https://www.chrsep.dev pnpm --filter web test:seo:live` against the deployed result; it should replace the 462-check pre-deployment failure baseline with a clean run.
3. Reconfirm one-hop aliases, query preservation, apex-to-www, true 404 status, `X-Robots-Tag` headers, content types, Studio rewrites, and client-navigation head replacement on the deployed CDN.
4. Test representative pages in a schema validator and social-card preview tools after the assets are publicly available.
5. Add the sitemap in Google Search Console, inspect all eight canonical URLs, and monitor indexing, duplicate/canonical reports, rich-result parsing, search queries, and Core Web Vitals.
6. Add Search Console verification metadata only after a real verification token is available.

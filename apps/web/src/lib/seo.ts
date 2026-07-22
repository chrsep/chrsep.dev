import { ROUTE_DEFINITIONS, SEO_ROUTE_IDS, SITE_ORIGIN } from "$lib/routes"

export { SEO_ROUTE_IDS, SITE_ORIGIN }
export const SITE_NAME = "Chrisando E. Pramudhita" as const

export type Locale = "en" | "id"
export type SeoRouteId = (typeof SEO_ROUTE_IDS)[number]
export type SeoSchemaKind = "home" | "profile" | "cv" | "workshop"

type LocalizedValue = Readonly<Record<Locale, string>>

export type SeoRouteConfig = {
  paths: LocalizedValue
  socialImage: string
  socialImageAlt: LocalizedValue
  schemaKind: SeoSchemaKind
}

export type IndexableSeoProps = {
  mode: "indexable"
  routeId: SeoRouteId
  locale: Locale
  title: string
  description: string
}

export type NoindexSeoProps = {
  mode: "noindex"
  locale: Locale
  title: string
  description: string
}

export type SeoProps = IndexableSeoProps | NoindexSeoProps

// Reshaped from the shared route registry (the single source of truth for
// pathnames and route ids) so SEO presentation data lives beside the analytics
// and pathname classifications it must stay in sync with.
export const SEO_ROUTES: Record<SeoRouteId, SeoRouteConfig> = Object.fromEntries(
  ROUTE_DEFINITIONS.map((route): [SeoRouteId, SeoRouteConfig] => [
    route.seoId,
    {
      paths: route.paths,
      socialImage: route.socialImage,
      socialImageAlt: route.socialImageAlt,
      schemaKind: route.schemaKind,
    },
  ]),
) as Record<SeoRouteId, SeoRouteConfig>

export function absoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).href
}

export function getSeoRoute(routeId: SeoRouteId, locale: Locale) {
  const route = SEO_ROUTES[routeId]

  return {
    ...route,
    canonicalPath: route.paths[locale],
    canonicalUrl: absoluteUrl(route.paths[locale]),
    alternateUrls: {
      en: absoluteUrl(route.paths.en),
      id: absoluteUrl(route.paths.id),
      xDefault: absoluteUrl(route.paths.en),
    },
    socialImageUrl: absoluteUrl(route.socialImage),
    socialImageAltText: route.socialImageAlt[locale],
  }
}

type JsonLdNode = Record<string, unknown>

export type JsonLdGraph = {
  "@context": "https://schema.org"
  "@graph": JsonLdNode[]
}

const WEBSITE_ID = `${SITE_ORIGIN}/#website`
const PERSON_ID = `${SITE_ORIGIN}/#person`
const PDF_URL = absoluteUrl("/resources/vibecoding-workshop.pdf")

const personNode: JsonLdNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Chrisando Eka Pramudhita",
  alternateName: ["Chrisando E. Pramudhita", "Chris", "chrsep"],
  url: absoluteUrl("/"),
  jobTitle: "Full-Stack Software Developer",
  homeLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "South Tangerang",
      addressCountry: "ID",
    },
  },
  sameAs: [
    "https://github.com/chrsep",
    "https://www.linkedin.com/in/chrsep",
    "https://x.com/_chrsep",
    "https://stackoverflow.com/users/6656573/chrsep",
  ],
}

const websiteNode: JsonLdNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: absoluteUrl("/"),
  name: SITE_NAME,
  alternateName: ["chrsep.dev", "@chrsep"],
  inLanguage: ["en", "id"],
  publisher: { "@id": PERSON_ID },
}

export function buildStructuredData(props: IndexableSeoProps): JsonLdGraph {
  const route = getSeoRoute(props.routeId, props.locale)
  const webPageId = `${route.canonicalUrl}#webpage`
  const commonPageProperties: JsonLdNode = {
    "@id": webPageId,
    url: route.canonicalUrl,
    name: props.title,
    description: props.description,
    inLanguage: props.locale,
    isPartOf: { "@id": WEBSITE_ID },
  }

  if (route.schemaKind === "home") {
    const webPage: JsonLdNode = {
      "@type": "WebPage",
      ...commonPageProperties,
      about: { "@id": PERSON_ID },
    }

    return {
      "@context": "https://schema.org",
      "@graph":
        props.locale === "en" ? [websiteNode, webPage, personNode] : [webPage],
    }
  }

  if (route.schemaKind === "profile") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfilePage",
          ...commonPageProperties,
          mainEntity: { "@id": PERSON_ID },
        },
        personNode,
      ],
    }
  }

  if (route.schemaKind === "cv") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          ...commonPageProperties,
          about: { "@id": PERSON_ID },
        },
      ],
    }
  }

  const learningResourceId = `${route.canonicalUrl}#learning-resource`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        ...commonPageProperties,
        mainEntity: { "@id": learningResourceId },
      },
      {
        "@type": "LearningResource",
        "@id": learningResourceId,
        url: route.canonicalUrl,
        name: props.title,
        description: props.description,
        inLanguage: props.locale,
        learningResourceType: "Workshop resources",
        isAccessibleForFree: true,
        author: { "@id": PERSON_ID },
        hasPart: { "@id": PDF_URL },
      },
      {
        "@type": "PresentationDigitalDocument",
        "@id": PDF_URL,
        url: PDF_URL,
        name: "Vibe Coding workshop presentation",
        encodingFormat: "application/pdf",
        isAccessibleForFree: true,
        author: { "@id": PERSON_ID },
      },
    ],
  }
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

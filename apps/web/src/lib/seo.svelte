<script lang="ts">
  import {
    buildStructuredData,
    getSeoRoute,
    serializeJsonLd,
    SITE_NAME,
    type SeoProps,
  } from "$lib/seo"

  let props: SeoProps = $props()

  const route = $derived(
    props.mode === "indexable"
      ? getSeoRoute(props.routeId, props.locale)
      : null,
  )
  const openGraphLocale = $derived(props.locale === "id" ? "id_ID" : "en_US")
  const alternateOpenGraphLocale = $derived(
    props.locale === "id" ? "en_US" : "id_ID",
  )
  const jsonLdScript = $derived.by(() => {
    if (props.mode !== "indexable") return ""

    const serialized = serializeJsonLd(buildStructuredData(props))
    return `<script type="application/ld+json">${serialized}<${"/"}script>`
  })
</script>

<svelte:head>
  <title>{props.title}</title>
  <meta name="description" content={props.description} />

  {#if props.mode === "indexable" && route}
    <meta name="robots" content="max-image-preview:large" />

    <!-- Canonical + hreflang are emitted once at the layout level (for every
         known route) so they stay present even for pages that don't render Seo. -->
    <meta property="og:title" content={props.title} />
    <meta property="og:description" content={props.description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={route.canonicalUrl} />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:locale" content={openGraphLocale} />
    <meta property="og:locale:alternate" content={alternateOpenGraphLocale} />
    <meta property="og:image" content={route.socialImageUrl} />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={route.socialImageAltText} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@_chrsep" />
    <meta name="twitter:creator" content="@_chrsep" />
    <meta name="twitter:title" content={props.title} />
    <meta name="twitter:description" content={props.description} />
    <meta name="twitter:image" content={route.socialImageUrl} />
    <meta name="twitter:image:alt" content={route.socialImageAltText} />

    <!-- The JSON serializer escapes HTML-significant characters before rendering. -->
    {@html jsonLdScript}
  {:else}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

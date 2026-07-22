<script lang="ts">
  import { page } from "$app/state"
  import { onMount } from "svelte"
  import ButtonLink from "$lib/button-link.svelte"
  import { capture } from "$lib/analytics"
  import { m } from "$lib/paraglide/messages"
  import { getLocale, localizeHref } from "$lib/paraglide/runtime"
  import Seo from "$lib/seo.svelte"

  const locale = getLocale()
  const isNotFound = $derived(page.status === 404)

  function pathPattern(pathname: string) {
    const segments = pathname.split("/").filter(Boolean)
    const localeOffset = segments[0] === "id" ? 1 : 0
    const knownRootSegments = new Set(["about", "cv", "resources"])

    const normalized = segments.map((segment, index) => {
      if (index === 0 && segment === "id") return "id"
      if (index === localeOffset && knownRootSegments.has(segment)) {
        return segment
      }
      return ":unknown"
    })

    return normalized.length > 0 ? `/${normalized.join("/")}` : "/"
  }

  onMount(() => {
    if (page.status !== 404) return

    const segments = page.url.pathname.split("/").filter(Boolean)
    let referrerType: "none" | "same_origin" | "external" = "none"
    if (document.referrer) {
      referrerType =
        new URL(document.referrer).origin === window.location.origin
          ? "same_origin"
          : "external"
    }

    capture("page not found viewed", {
      status: 404,
      path_pattern: pathPattern(page.url.pathname),
      path_depth: segments.length,
      referrer_type: referrerType,
    })
  })
</script>

<Seo
  mode="noindex"
  {locale}
  title={isNotFound ? m.error_title() : m.error_generic_title()}
  description={isNotFound
    ? m.error_description()
    : m.error_generic_description()}
/>

<section
  class="mx-auto flex min-h-[70vh] max-w-[1920px] items-center px-6 py-20 sm:px-8 md:px-32"
>
  <div class="max-w-2xl">
    <p class="text-ink-700 mb-4 text-sm font-bold">{page.status}</p>
    <h1 class="max-w-xl text-4xl leading-tight font-black sm:text-5xl">
      {isNotFound ? m.error_heading() : m.error_generic_heading()}
    </h1>
    <p class="text-ink-700 mt-6 max-w-xl text-lg leading-relaxed">
      {isNotFound ? m.error_body() : m.error_generic_body()}
    </p>
    <ButtonLink href={localizeHref("/")} class="mt-8 !inline-flex">
      {m.error_home()}
      <span aria-hidden="true" class="ml-3">→</span>
    </ButtonLink>
  </div>
</section>

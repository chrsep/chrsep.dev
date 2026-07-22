<script lang="ts">
  import { page } from "$app/state"
  import { onMount } from "svelte"
  import { capture } from "$lib/analytics"

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

  const title = $derived(page.status === 404 ? "Page not found" : "Page error")
  const message = $derived(
    page.status === 404
      ? "The page you requested does not exist or may have moved."
      : (page.error?.message ??
          "Something went wrong while loading this page."),
  )
</script>

<svelte:head>
  <title>{page.status} · {title}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section
  class="mx-auto flex min-h-[70vh] max-w-3xl items-center px-6 py-20 sm:px-8 md:px-32"
>
  <div>
    <p class="text-ink-600 text-sm font-semibold">Error {page.status}</p>
    <h1
      class="text-ink-900 mt-3 text-4xl font-black tracking-tight sm:text-5xl"
    >
      {title}
    </h1>
    <p class="text-ink-700 mt-5 max-w-xl leading-7">{message}</p>
    <a
      href="/"
      class="ring-offset-default-900 mt-8 inline-flex rounded-xl bg-white px-6 py-4 font-bold text-black ring-white transition hover:bg-gray-100 hover:ring-2 hover:ring-offset-4"
    >
      Back to home
    </a>
  </div>
</section>

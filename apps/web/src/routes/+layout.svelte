<script lang="ts">
  import "@fontsource-variable/inter"
  import interVariableLatinUrl from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url"

  import "../app.css"
  import ButtonLink from "$lib/button-link.svelte"
  import Icon from "$lib/icon.svelte"
  import type { Snippet } from "svelte"
  import { page } from "$app/state"
  import { m } from "$lib/paraglide/messages"
  import {
    deLocalizeHref,
    getLocale,
    locales,
    localizeHref,
  } from "$lib/paraglide/runtime"
  import { afterNavigate } from "$app/navigation"
  import { capture, captureOutboundLink, capturePageview } from "$lib/analytics"
  import { inferAnalyticsRoute, matchRoute } from "$lib/routes"
  import { getSeoRoute } from "$lib/seo"

  let { children }: { children?: Snippet } = $props()

  const localeNames: Record<string, string> = {
    en: "English",
    id: "Bahasa Indonesia",
  }

  afterNavigate(({ to }) => {
    const url = to?.url ?? new URL(window.location.href)
    capturePageview(url.href, {
      route_id: inferAnalyticsRoute(url.pathname),
      locale: getLocale(),
    })
  })

  const canonicalPath = $derived(deLocalizeHref(page.url.pathname))

  // Canonical + hreflang are emitted here at the layout level so EVERY known
  // route gets them structurally, independent of whether a page wires up <Seo>.
  const seoRoute = $derived.by(() => {
    const match = matchRoute(page.url.pathname)
    return match ? getSeoRoute(match.seoId, getLocale()) : null
  })

  function localizedPath(path: string, locale: (typeof locales)[number]) {
    const href = localizeHref(path, { locale })
    return href !== "/" && href.endsWith("/") ? href.slice(0, -1) : href
  }

  function captureLanguageChange(toLocale: (typeof locales)[number]) {
    const fromLocale = getLocale()
    if (fromLocale === toLocale) return

    capture("language changed", {
      from_locale: fromLocale,
      to_locale: toLocale,
    })
  }

  function captureContact(location: "footer_primary" | "footer_email") {
    capture("contact cta clicked", {
      location,
      destination: "email",
    })
  }

  function captureFooterSocial(
    label: "github" | "linkedin" | "twitter" | "stackoverflow",
    destinationUrl: string,
  ) {
    captureOutboundLink(
      {
        destination_id: label,
        url: destinationUrl,
        placement: "footer_social",
      },
      { label, category: "social" },
    )
  }
</script>

<svelte:head>
  <link
    rel="preload"
    href={interVariableLatinUrl}
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />

  {#if seoRoute}
    <link rel="canonical" href={seoRoute.canonicalUrl} />
    <link rel="alternate" hreflang="en" href={seoRoute.alternateUrls.en} />
    <link rel="alternate" hreflang="id" href={seoRoute.alternateUrls.id} />
    <link
      rel="alternate"
      hreflang="x-default"
      href={seoRoute.alternateUrls.xDefault}
    />
  {/if}
</svelte:head>

<a
  href="#main-content"
  class="bg-ink-900 text-default-900 fixed top-2 left-2 z-50 -translate-y-20 rounded-lg px-4 py-3 font-bold transition-transform focus:translate-y-0"
>
  {m.skip_to_content()}
</a>

<nav
  class="bg-default-900 bg-opacity-80 text-ink-900 fixed inset-x-0 top-0 z-40 h-12 w-full px-4 text-sm backdrop-blur-lg backdrop-filter sm:h-16 sm:px-8 md:px-12 lg:px-20 xl:px-32"
>
  <div class="mx-auto flex h-12 max-w-[1920px] gap-3 sm:h-16 sm:gap-6">
    <a
      href={localizedPath("/", getLocale())}
      aria-current={canonicalPath === "/" ? "page" : undefined}
      class="group mr-auto flex h-full min-w-0 items-center font-bold"
    >
      <div class="h-5 w-20 overflow-hidden sm:w-56">
        <div
          class="transform whitespace-nowrap transition-transform duration-500 ease-in-out sm:group-hover:-translate-y-1/2"
        >
          <span class="text-xs font-black sm:text-sm"> @chrsep </span><br />
          🏠 <span class="ml-1">Chrisando E. Pramudhita</span>
        </div>
      </div>
    </a>

    <a
      href={localizeHref("/about")}
      aria-current={canonicalPath === "/about" ? "page" : undefined}
      class="text-ink-700 hover:text-ink-900 flex h-full items-center font-medium transition-colors"
    >
      {m.nav_about()}
    </a>

    <a
      href={localizeHref("/cv")}
      aria-current={canonicalPath === "/cv" ? "page" : undefined}
      class="text-ink-700 hover:text-ink-900 flex h-full items-center font-medium transition-colors"
    >
      {m.nav_cv()}
    </a>

    <a
      href={localizeHref("/resources/vibecoding-demo")}
      aria-current={canonicalPath === "/resources/vibecoding-demo"
        ? "page"
        : undefined}
      class="text-ink-700 hover:text-ink-900 hidden h-full items-center font-medium transition-colors lg:flex"
    >
      {m.nav_resources()}
    </a>

    <ul
      class="flex h-full items-center gap-1 text-xs font-medium"
      aria-label={m.language_switcher_label()}
    >
      {#each locales as locale, i}
        {#if i > 0}
          <li aria-hidden="true" class="text-ink-700 opacity-40">/</li>
        {/if}
        <li>
          <a
            href={localizedPath(canonicalPath, locale)}
            hreflang={locale}
            aria-label={localeNames[locale]}
            aria-current={locale === getLocale() ? "page" : undefined}
            data-sveltekit-reload
            onclick={() => captureLanguageChange(locale)}
            class="flex min-h-11 min-w-8 items-center justify-center transition-colors {locale ===
            getLocale()
              ? 'text-ink-900'
              : 'text-ink-700 hover:text-ink-900'}"
          >
            {locale.toUpperCase()}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>

<main
  id="main-content"
  tabindex="-1"
  class="text-ink-900 mt-12 min-h-screen outline-none sm:mt-16"
>
  {@render children?.()}
</main>

<footer
  class="text-ink-900 mt-32 border-t border-[#ffffff0D] pt-12 pb-6 sm:py-16"
>
  <div
    class="mx-auto flex max-w-[1920px] flex-col px-6 sm:flex-row sm:items-end sm:px-8 md:px-32"
  >
    <div>
      <h2 class="text-xl leading-tight font-black md:text-2xl">
        {m.lets_work_together()}
      </h2>
      <p class="text-ink-800 my-4 max-w-sm opacity-70 sm:mb-0">
        {m.footer_body()}
      </p>
      <ButtonLink
        href="mailto:hi@chrsep.dev"
        class="group mt-2 mb-4 !inline-block w-full text-sm sm:mt-6 sm:mr-4 sm:mb-0 sm:w-auto"
        onclick={() => captureContact("footer_primary")}
      >
        {m.footer_cta()}
        <span
          class="mr-1 ml-auto transform transition-transform duration-200 ease-in-out group-hover:translate-x-2 sm:ml-3"
        >
          ->
        </span>
      </ButtonLink>
    </div>

    <div class="mt-12 sm:ml-auto">
      <a
        href="mailto:hi@chrsep.dev"
        class="text-ink-900 flex min-h-11 items-center font-medium opacity-70 transition hover:opacity-100"
        onclick={() => captureContact("footer_email")}
      >
        <svg
          class="mr-3 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        hi@chrsep.dev
      </a>

      <ul class="mt-4 -ml-2 flex items-center gap-4">
        <li>
          <a
            href="https://github.com/chrsep"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            class="flex min-h-11 min-w-11 items-center justify-center rounded-lg opacity-70 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
            onclick={() =>
              captureFooterSocial("github", "https://github.com/chrsep")}
          >
            <Icon --src="url(/icons/github.svg)" class="h-4 w-4" />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/chrsep"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            class="flex min-h-11 min-w-11 items-center justify-center rounded-lg opacity-70 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
            onclick={() =>
              captureFooterSocial(
                "linkedin",
                "https://www.linkedin.com/in/chrsep",
              )}
          >
            <Icon --src="url(/icons/linkedin.svg)" class="h-4 w-4" />
          </a>
        </li>
        <li>
          <a
            href="https://x.com/_chrsep"
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            class="flex min-h-11 min-w-11 items-center justify-center rounded-lg opacity-70 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
            onclick={() =>
              captureFooterSocial("twitter", "https://x.com/_chrsep")}
          >
            <Icon --src="url(/icons/twitter.svg)" class="h-4 w-4" />
          </a>
        </li>
        <li>
          <a
            href="https://stackoverflow.com/users/6656573/chrsep"
            target="_blank"
            rel="noreferrer"
            aria-label="Stack Overflow"
            class="flex min-h-11 min-w-11 items-center justify-center rounded-lg opacity-70 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
            onclick={() =>
              captureFooterSocial(
                "stackoverflow",
                "https://stackoverflow.com/users/6656573/chrsep",
              )}
          >
            <Icon --src="url(/icons/stackoverflow.svg)" class="h-4 w-4" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</footer>

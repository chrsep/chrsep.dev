<script lang="ts">
  import "@fontsource-variable/inter"

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
  import { onMount } from "svelte"
  import { afterNavigate } from "$app/navigation"
  import { initPostHog, posthog } from "$lib/posthog"

  let { children }: { children?: Snippet } = $props()

  const localeNames: Record<string, string> = {
    en: "English",
    id: "Bahasa Indonesia",
  }

  onMount(() => {
    initPostHog()
  })

  afterNavigate(({ to }) => {
    posthog.capture("$pageview", {
      $current_url: to?.url.href ?? window.location.href,
    })
  })

  const canonicalPath = $derived(deLocalizeHref(page.url.pathname))

  function localizedPath(path: string, locale: (typeof locales)[number]) {
    const href = localizeHref(path, { locale })
    return href !== "/" && href.endsWith("/") ? href.slice(0, -1) : href
  }
</script>

<svelte:head>
  <link rel="canonical" href={`https://chrsep.dev${page.url.pathname}`} />
  {#each locales as locale}
    <link
      rel="alternate"
      hreflang={locale}
      href={`https://chrsep.dev${localizedPath(canonicalPath, locale)}`}
    />
  {/each}
  <link
    rel="alternate"
    hreflang="x-default"
    href={`https://chrsep.dev${canonicalPath}`}
  />
</svelte:head>

<nav
  class="bg-default-900/55 text-ink-900 fixed inset-x-0 top-0 z-10 h-12 w-full border-b border-white/5 px-6 text-sm backdrop-blur-xl backdrop-filter transition-colors duration-300 sm:h-16 sm:px-8 md:px-32"
>
  <div class="mx-auto flex h-12 max-w-[1920px] gap-4 sm:h-16 sm:gap-8">
    <a
      href={localizedPath("/", getLocale())}
      class="group mr-auto flex h-full items-center font-bold"
    >
      <div class="h-5 overflow-hidden">
        <div
          class="transform transition-transform duration-500 ease-in-out sm:group-hover:-translate-y-1/2"
        >
          <span class="text-xs font-black sm:text-sm"> @chrsep </span><br />
          🏠 <span class="ml-1">Chrisando E. Pramudhita</span>
        </div>
      </div>
    </a>

    <a
      href={localizeHref("/cv")}
      class="text-ink-700 hover:text-ink-900 flex h-full items-center font-medium transition-colors"
    >
      {m.nav_cv()}
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
            class="transition-colors {locale === getLocale()
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

<main class="text-ink-900 mt-12 min-h-screen sm:mt-16">
  {@render children?.()}
</main>

<footer
  class="text-ink-900 mt-32 border-t border-[#ffffff0D] pt-12 pb-6 sm:py-12 sm:py-16"
>
  <div
    class="mx-auto flex max-w-[1920px] flex-col px-6 sm:flex-row sm:items-end sm:px-8 md:px-32"
  >
    <div>
      <h1 class="text-xl leading-tight font-black md:text-2xl">
        {m.lets_work_together()}
      </h1>
      <p class="text-ink-800 my-4 max-w-sm opacity-70 sm:mb-0">
        {m.footer_body()}
      </p>
      <ButtonLink
        href="mailto:hi@chrsep.dev"
        class="group mt-2 mb-4 !inline-block w-full text-sm sm:mt-6 sm:mr-4 sm:mb-0 sm:w-auto"
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
        class="text-ink-900 flex items-center font-medium opacity-40 transition hover:opacity-100"
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
            class="flex items-center rounded-lg p-2 opacity-40 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
          >
            <Icon --src="url(/icons/github.svg)" class="h-4 w-4" />
          </a>
        </li>
        <li>
          <a
            href="https://linkedin.com/in/chrsep"
            class="flex items-center rounded-lg p-2 opacity-40 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
          >
            <Icon --src="url(/icons/linkedin.svg)" class="h-4 w-4" />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/_chrsep"
            class="flex items-center rounded-lg p-2 opacity-40 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
          >
            <Icon --src="url(/icons/twitter.svg)" class="h-4 w-4" />
          </a>
        </li>
        <li>
          <a
            href="https://stackoverflow.com/users/story/6656573"
            class="flex items-center rounded-lg p-2 opacity-40 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
          >
            <Icon --src="url(/icons/stackoverflow.svg)" class="h-4 w-4" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</footer>

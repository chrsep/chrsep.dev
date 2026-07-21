<script lang="ts">
  import { onMount, type Snippet } from "svelte"
  import { fade } from "svelte/transition"
  import { page } from "$app/state"
  import { m } from "$lib/paraglide/messages"
  import { localizeHref } from "$lib/paraglide/runtime"
  import { posthog } from "$lib/posthog"
  import { defaultSessionSlug } from "$lib/vibecoding/agent-sessions/manifest"

  let { children }: { children: Snippet } = $props()

  const basePath = "/resources/vibecoding-demo"

  const tabs = [
    {
      id: "summary",
      label: m.vibe_tab_summary(),
      href: basePath,
      routeId: basePath,
    },
    {
      id: "links",
      label: m.vibe_tab_links(),
      href: `${basePath}/links`,
      routeId: `${basePath}/links`,
    },
    {
      id: "agent-sessions",
      label: m.vibe_tab_sessions(),
      href: `${basePath}/agent-sessions/${defaultSessionSlug}`,
      routeId: `${basePath}/agent-sessions`,
    },
    {
      id: "qa",
      label: m.vibe_tab_qa(),
      href: `${basePath}/qa`,
      routeId: `${basePath}/qa`,
    },
  ] as const

  function isActive(tab: (typeof tabs)[number]) {
    if (tab.id === "summary") return page.route.id === tab.routeId
    return page.route.id?.startsWith(tab.routeId) ?? false
  }

  // The static shell ships the placeholder image only; the iframe mounts after
  // hydration and fades in over it once its content has loaded.
  let iframeMounted = $state(false)
  let iframeLoaded = $state(false)

  onMount(() => {
    iframeMounted = true
  })
</script>

<section
  class="mx-auto min-h-[70vh] max-w-[1920px] px-6 pt-12 pb-8 sm:px-8 sm:pt-20 sm:pb-12 md:px-32"
  in:fade={{ duration: 250 }}
>
  <header
    class="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
  >
    <h1
      class="text-ink-900 text-4xl leading-tight font-black tracking-tight sm:text-5xl md:text-6xl"
    >
      Vibe Coding
    </h1>

    <div class="flex w-full items-center gap-5 sm:w-auto sm:justify-end">
      <a
        class="text-ink-700 hover:text-ink-900 inline-flex min-h-11 items-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        href="https://vibecoding-workshop-gilt.vercel.app/"
        target="_blank"
        rel="noreferrer"
        onclick={() => posthog.capture("vibecoding presentation opened")}
      >
        {m.vibe_open_presentation()}
        <span class="ml-1.5" aria-hidden="true">↗</span>
      </a>

      <a
        class="text-ink-700 hover:text-ink-900 inline-flex min-h-11 items-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        href="/resources/vibecoding-workshop.pdf"
        download="vibecoding-workshop.pdf"
        onclick={() => posthog.capture("vibecoding pdf downloaded")}
      >
        {m.vibe_download()}
        <span class="ml-1.5" aria-hidden="true">↓</span>
      </a>
    </div>
  </header>

  <div
    class="relative overflow-hidden rounded-xl border border-[#ffffff14] bg-black shadow-sm"
  >
    <img
      class="block aspect-video w-full"
      src="/resources/vibecoding-demo/slides-placeholder.png"
      alt={m.vibe_iframe_title()}
      width="1920"
      height="1080"
      fetchpriority="high"
      decoding="async"
    />
    {#if iframeMounted}
      <iframe
        class="absolute inset-0 block h-full w-full transition-opacity duration-300 {iframeLoaded
          ? 'opacity-100'
          : 'opacity-0'}"
        src="https://vibecoding-workshop-gilt.vercel.app/"
        title={m.vibe_iframe_title()}
        allow="fullscreen"
        allowfullscreen
        onload={() => (iframeLoaded = true)}
      ></iframe>
    {/if}
  </div>

  <p class="text-ink-700 mt-3 text-xs sm:text-sm">
    {m.vibe_presentation_hint()}
  </p>

  <section class="mt-16 border-t border-[#ffffff14] pt-9 sm:mt-20 sm:pt-12">
    <div class="mb-5 max-w-3xl sm:mb-6">
      <h2
        class="text-ink-900 text-3xl leading-tight font-black tracking-tight sm:text-4xl md:text-5xl"
      >
        {m.vibe_resources_heading()}
      </h2>
      <p class="text-ink-700 mt-3 max-w-2xl text-base leading-7 sm:text-lg">
        {m.vibe_resources_body()}
      </p>
    </div>

    <div
      class="tab-scroll -mx-6 overflow-x-auto border-b border-[#ffffff1f] px-6 sm:mx-0 sm:px-0"
    >
      <nav
        class="-ml-2.5 flex min-w-max sm:-ml-3"
        aria-label={m.vibe_tablist_label()}
      >
        {#each tabs as tab}
          <a
            class="relative flex min-h-11 shrink-0 items-center px-2.5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:px-3 {isActive(
              tab,
            )
              ? 'text-ink-900'
              : 'text-ink-700 hover:text-ink-900'}"
            href={localizeHref(tab.href)}
            aria-current={isActive(tab) ? "page" : undefined}
            data-sveltekit-noscroll
            onclick={() =>
              posthog.capture("vibecoding tab switched", { tab: tab.id })}
          >
            {tab.label}
            {#if isActive(tab)}
              <span
                class="absolute inset-x-2.5 -bottom-px h-0.5 bg-white sm:inset-x-3"
                aria-hidden="true"
              ></span>
            {/if}
          </a>
        {/each}
      </nav>
    </div>

    {@render children()}
  </section>
</section>

<style>
  .tab-scroll {
    scrollbar-width: none;
  }

  .tab-scroll::-webkit-scrollbar {
    display: none;
  }
</style>

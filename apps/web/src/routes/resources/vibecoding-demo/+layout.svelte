<script lang="ts">
  import type { Snippet } from "svelte"
  import { fade } from "svelte/transition"
  import { page } from "$app/state"
  import PresentationPoster from "$lib/vibecoding/presentation-poster.svelte"
  import { m } from "$lib/paraglide/messages"
  import { deLocalizeHref, localizeHref } from "$lib/paraglide/runtime"
  import { capture } from "$lib/posthog"

  let { children }: { children?: Snippet } = $props()

  let presentationLoaded = $state(false)

  const tabs = [
    { path: "/resources/vibecoding-demo", label: m.vibe_tab_summary() },
    { path: "/resources/vibecoding-demo/links", label: m.vibe_tab_links() },
    {
      path: "/resources/vibecoding-demo/sessions",
      label: m.vibe_tab_sessions(),
    },
    { path: "/resources/vibecoding-demo/qa", label: m.vibe_tab_qa() },
  ] as const

  const canonicalPath = $derived(deLocalizeHref(page.url.pathname))
</script>

<section
  class="mx-auto min-h-[70vh] max-w-[1920px] px-6 pt-12 pb-8 sm:px-8 sm:pt-20 sm:pb-12 md:px-32"
  in:fade={{ duration: 250 }}
>
  <header
    class="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
  >
    <div class="max-w-3xl">
      <h1
        class="text-ink-900 text-4xl leading-tight font-black tracking-tight sm:text-5xl md:text-6xl"
      >
        Vibe Coding
      </h1>
      <p class="text-ink-700 mt-3 max-w-2xl text-base leading-7 sm:text-lg">
        {m.vibe_description()}
      </p>
    </div>

    <div class="flex w-full items-center gap-5 sm:w-auto sm:justify-end">
      <a
        class="text-ink-700 hover:text-ink-900 inline-flex min-h-11 items-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        href="https://vibecoding-workshop-gilt.vercel.app/"
        target="_blank"
        rel="noreferrer"
        onclick={() => capture("vibecoding presentation opened")}
      >
        {m.vibe_open_presentation()}
        <span class="ml-1.5" aria-hidden="true">↗</span>
      </a>

      <a
        class="text-ink-700 hover:text-ink-900 inline-flex min-h-11 items-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        href="/resources/vibecoding-workshop.pdf"
        download="vibecoding-workshop.pdf"
        onclick={() => capture("vibecoding pdf downloaded")}
      >
        {m.vibe_download()}
        <span class="ml-1.5" aria-hidden="true">↓</span>
      </a>
    </div>
  </header>

  <div
    class="overflow-hidden rounded-xl border border-[#ffffff14] bg-black shadow-sm"
  >
    {#if presentationLoaded}
      <iframe
        class="block aspect-video w-full"
        src="https://vibecoding-workshop-gilt.vercel.app/"
        title={m.vibe_iframe_title()}
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="fullscreen"
        allowfullscreen
      ></iframe>
    {:else}
      <button
        type="button"
        class="group relative block aspect-video w-full overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        onclick={() => {
          presentationLoaded = true
          capture("vibecoding embedded presentation loaded")
        }}
        aria-label={m.vibe_load_presentation()}
      >
        <PresentationPoster />
        <span
          class="absolute inset-0 flex items-end justify-center pb-[5%] transition-colors duration-300 group-hover:bg-[#3a332a]/8"
        >
          <span
            class="inline-flex min-h-9 items-center rounded-xl bg-[#3a332a] px-3.5 py-2 text-xs font-bold text-[#f8f4e9] shadow-lg transition-transform duration-200 group-hover:scale-[1.02] sm:min-h-11 sm:px-5 sm:py-3 sm:text-sm"
          >
            <span class="mr-2" aria-hidden="true">▶</span>
            {m.vibe_load_presentation()}
          </span>
        </span>
      </button>
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

    <nav
      class="tab-scroll -mx-6 overflow-x-auto border-b border-[#ffffff1f] px-6 sm:mx-0 sm:px-0"
      aria-label={m.vibe_tablist_label()}
    >
      <ul class="-ml-2.5 flex min-w-max sm:-ml-3">
        {#each tabs as tab}
          {@const current = canonicalPath === tab.path}
          <li>
            <a
              href={localizeHref(tab.path)}
              aria-current={current ? "page" : undefined}
              data-sveltekit-noscroll
              class="relative flex min-h-11 shrink-0 items-center px-2.5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:px-3 {current
                ? 'text-ink-900'
                : 'text-ink-700 hover:text-ink-900'}"
            >
              {tab.label}
              {#if current}
                <span
                  class="absolute inset-x-2.5 -bottom-px h-0.5 bg-white sm:inset-x-3"
                  aria-hidden="true"
                ></span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    {@render children?.()}
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

<script lang="ts">
  import { fade } from "svelte/transition"

  type TabId = "links" | "agent-sessions" | "summary" | "qa"

  type LinkGroup = {
    title: string
    description: string
    links: readonly {
      label: string
      description: string
      domain: string
      href: string
    }[]
  }

  const tabs = [
    { id: "links", label: "Links" },
    { id: "agent-sessions", label: "Agent Sessions" },
    { id: "summary", label: "Summary" },
    { id: "qa", label: "Q&A" },
  ] as const satisfies readonly { id: TabId; label: string }[]

  const linkGroups = [
    {
      title: "Resources",
      description: "Explore the workshop materials and the app built live.",
      links: [
        {
          label: "Skills.sh",
          description: "Discover reusable skills for AI agents.",
          domain: "skills.sh",
          href: "https://www.skills.sh/",
        },
        {
          label: "chrsep/inventory",
          description: "Browse the source code from the live demo.",
          domain: "github.com",
          href: "https://github.com/chrsep/inventory",
        },
        {
          label: "Inventory live demo",
          description: "Open the deployed inventory application.",
          domain: "inventory-wine-five.vercel.app",
          href: "https://inventory-wine-five.vercel.app/",
        },
        {
          label: "chrsep/vibecoding-workshop",
          description: "See the slides and workshop source.",
          domain: "github.com",
          href: "https://github.com/chrsep/vibecoding-workshop",
        },
      ],
    },
    {
      title: "Tools",
      description: "The services used to build, store, and ship the demo.",
      links: [
        {
          label: "Vercel",
          description: "Deploy and host the application.",
          domain: "vercel.com",
          href: "https://vercel.com/",
        },
        {
          label: "GitHub",
          description: "Store the code and its history.",
          domain: "github.com",
          href: "https://github.com/",
        },
        {
          label: "Neon",
          description: "Run the Postgres database behind the app.",
          domain: "neon.com",
          href: "https://neon.com/",
        },
        {
          label: "Codex",
          description: "Build and iterate with an AI coding agent.",
          domain: "openai.com/codex",
          href: "https://openai.com/codex/",
        },
      ],
    },
  ] as const satisfies readonly LinkGroup[]

  let activeTab: TabId = "links"

  function selectTab(tabId: TabId, moveFocus = false) {
    activeTab = tabId

    if (moveFocus) {
      requestAnimationFrame(() => {
        document.getElementById(`tab-${tabId}`)?.focus()
      })
    }
  }

  function handleTabKeydown(event: KeyboardEvent, currentIndex: number) {
    let nextIndex: number | undefined

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1
    }

    if (nextIndex === undefined) return

    event.preventDefault()
    selectTab(tabs[nextIndex].id, true)
  }
</script>

<svelte:head>
  <title>Vibe Coding | Chrisando E. Pramudhita</title>
  <meta
    name="description"
    content="Vibe Coding workshop presentation, live demo, repositories, and tools by Chrisando."
  />
  <link rel="canonical" href="https://chrsep.dev/resources/vibecoding-demo" />
</svelte:head>

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
      >
        Open presentation <span class="ml-1.5" aria-hidden="true">↗</span>
      </a>

      <a
        class="text-ink-700 hover:text-ink-900 inline-flex min-h-11 items-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        href="/resources/vibecoding-workshop.pdf"
        download="vibecoding-workshop.pdf"
      >
        Download <span class="ml-1.5" aria-hidden="true">↓</span>
      </a>
    </div>
  </header>

  <div
    class="overflow-hidden rounded-xl border border-[#ffffff14] bg-black shadow-sm"
  >
    <iframe
      class="block aspect-video w-full"
      src="https://vibecoding-workshop-gilt.vercel.app/"
      title="Interactive Vibe Coding workshop presentation"
      allow="fullscreen"
      allowfullscreen
    ></iframe>
  </div>

  <p class="text-ink-700 mt-3 text-xs sm:text-sm">
    Click the presentation, then use the arrow keys or Slidev controls to
    navigate.
  </p>

  <section class="mt-16 border-t border-[#ffffff14] pt-9 sm:mt-20 sm:pt-12">
    <div class="mb-8 max-w-2xl sm:mb-10">
      <h2 class="text-ink-900 text-2xl leading-tight font-black sm:text-3xl">
        Workshop resources
      </h2>
      <p class="text-ink-700 mt-3 max-w-xl text-sm leading-6 sm:text-base">
        Revisit the demo, explore the source, and find every tool used during
        the workshop.
      </p>
    </div>

    <div
      class="tab-scroll -mx-6 overflow-x-auto border-b border-[#ffffff1f] px-6 sm:mx-0 sm:px-0"
    >
      <div
        class="flex min-w-max"
        role="tablist"
        aria-label="Vibe Coding resources"
      >
        {#each tabs as tab, index}
          <button
            id={`tab-${tab.id}`}
            class="relative min-h-11 shrink-0 px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:px-5 {activeTab ===
            tab.id
              ? 'text-ink-900'
              : 'text-ink-700 hover:text-ink-900'}"
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabindex={activeTab === tab.id ? 0 : -1}
            onclick={() => selectTab(tab.id)}
            onkeydown={(event) => handleTabKeydown(event, index)}
          >
            {tab.label}
            {#if activeTab === tab.id}
              <span
                class="absolute inset-x-4 -bottom-px h-0.5 bg-white sm:inset-x-5"
                aria-hidden="true"
              ></span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <div
      id="panel-links"
      class="pt-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:pt-10"
      role="tabpanel"
      aria-labelledby="tab-links"
      tabindex="0"
      hidden={activeTab !== "links"}
    >
      <div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {#each linkGroups as group}
          <section aria-labelledby={`link-group-${group.title.toLowerCase()}`}>
            <div class="min-h-24 border-b border-[#ffffff1f] pb-5">
              <h3
                id={`link-group-${group.title.toLowerCase()}`}
                class="text-ink-900 text-lg font-bold"
              >
                {group.title}
              </h3>
              <p class="text-ink-700 mt-2 max-w-md text-sm leading-6">
                {group.description}
              </p>
            </div>

            <ul>
              {#each group.links as link}
                <li class="border-b border-[#ffffff14]">
                  <a
                    class="group -mx-3 flex min-h-24 items-center justify-between gap-5 px-3 py-4 transition-colors hover:bg-[#ffffff08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span class="min-w-0">
                      <span class="text-ink-900 block font-semibold">
                        {link.label}
                      </span>
                      <span class="text-ink-700 mt-1 block text-sm leading-5">
                        {link.description}
                      </span>
                      <span class="text-ink-700 mt-1.5 block text-xs">
                        {link.domain}
                      </span>
                    </span>
                    <span
                      class="text-ink-700 group-hover:text-ink-900 shrink-0 text-lg transition-colors"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              {/each}
            </ul>
          </section>
        {/each}
      </div>
    </div>

    <div
      id="panel-agent-sessions"
      class="flex min-h-72 max-w-2xl items-center py-12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:py-16"
      role="tabpanel"
      aria-labelledby="tab-agent-sessions"
      tabindex="0"
      hidden={activeTab !== "agent-sessions"}
    >
      <div>
        <h3 class="text-ink-900 text-2xl leading-tight font-black sm:text-3xl">
          Agent Sessions are almost ready.
        </h3>
        <p class="text-ink-700 mt-4 max-w-xl text-base leading-7">
          The full agent sessions will be published here in a couple of days.
        </p>
      </div>
    </div>

    <div
      id="panel-summary"
      class="flex min-h-72 max-w-2xl items-center py-12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:py-16"
      role="tabpanel"
      aria-labelledby="tab-summary"
      tabindex="0"
      hidden={activeTab !== "summary"}
    >
      <div>
        <h3 class="text-ink-900 text-2xl leading-tight font-black sm:text-3xl">
          The workshop summary is on the way.
        </h3>
        <p class="text-ink-700 mt-4 max-w-xl text-base leading-7">
          A concise workshop summary will be published here in a couple of days.
        </p>
      </div>
    </div>

    <div
      id="panel-qa"
      class="flex min-h-72 max-w-2xl items-center py-12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:py-16"
      role="tabpanel"
      aria-labelledby="tab-qa"
      tabindex="0"
      hidden={activeTab !== "qa"}
    >
      <div>
        <h3 class="text-ink-900 text-2xl leading-tight font-black sm:text-3xl">
          Q&amp;A is coming next.
        </h3>
        <p class="text-ink-700 mt-4 max-w-xl text-base leading-7">
          Answers to audience questions will be published here in a couple of
          days.
        </p>
      </div>
    </div>
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

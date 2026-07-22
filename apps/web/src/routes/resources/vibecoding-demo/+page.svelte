<script lang="ts">
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
  import { replaceState } from "$app/navigation"
  import AgentSessionViewer from "$lib/vibecoding/agent-sessions/agent-session-viewer.svelte"
  import { capture } from "$lib/analytics"
  import Seo from "$lib/seo.svelte"
  import { m } from "$lib/paraglide/messages"

  type TabId = "links" | "agent-sessions" | "summary" | "qa"

  type LinkGroup = {
    id: string
    title: string
    description: string
    links: readonly {
      label: string
      description: string
      domain: string
      href: string
      destinationId: string
    }[]
  }

  const analyticsContext = {
    content_id: "vibecoding_demo",
    resource_id: "vibecoding_demo",
    app_surface: "workshop_resource",
  } as const

  const tabs = [
    { id: "summary", label: m.vibe_tab_summary() },
    { id: "links", label: m.vibe_tab_links() },
    { id: "agent-sessions", label: m.vibe_tab_sessions() },
    { id: "qa", label: m.vibe_tab_qa() },
  ] as const satisfies readonly { id: TabId; label: string }[]

  const linkGroups = [
    {
      id: "resources",
      title: m.vibe_group_resources_title(),
      description: m.vibe_group_resources_description(),
      links: [
        {
          label: "Skills.sh",
          description: m.vibe_link_skills_description(),
          domain: "skills.sh",
          href: "https://www.skills.sh/",
          destinationId: "skills_directory",
        },
        {
          label: "chrsep/inventory",
          description: m.vibe_link_inventory_repo_description(),
          domain: "github.com",
          href: "https://github.com/chrsep/inventory",
          destinationId: "inventory_repository",
        },
        {
          label: m.vibe_link_inventory_demo_label(),
          description: m.vibe_link_inventory_demo_description(),
          domain: "inventory-wine-five.vercel.app",
          href: "https://inventory-wine-five.vercel.app/",
          destinationId: "inventory_demo",
        },
        {
          label: "chrsep/vibecoding-workshop",
          description: m.vibe_link_workshop_repo_description(),
          domain: "github.com",
          href: "https://github.com/chrsep/vibecoding-workshop",
          destinationId: "workshop_repository",
        },
      ],
    },
    {
      id: "tools",
      title: m.vibe_group_tools_title(),
      description: m.vibe_group_tools_description(),
      links: [
        {
          label: "Vercel",
          description: m.vibe_link_vercel_description(),
          domain: "vercel.com",
          href: "https://vercel.com/",
          destinationId: "vercel",
        },
        {
          label: "GitHub",
          description: m.vibe_link_github_description(),
          domain: "github.com",
          href: "https://github.com/",
          destinationId: "github",
        },
        {
          label: "Neon",
          description: m.vibe_link_neon_description(),
          domain: "neon.com",
          href: "https://neon.com/",
          destinationId: "neon",
        },
        {
          label: "Codex",
          description: m.vibe_link_codex_description(),
          domain: "openai.com/codex",
          href: "https://openai.com/codex/",
          destinationId: "codex",
        },
      ],
    },
  ] as const satisfies readonly LinkGroup[]

  const summarySections = [
    {
      id: "what-is-vibe-coding",
      heading: m.vibe_summary_what_heading(),
      paragraphs: [m.vibe_summary_what_p1(), m.vibe_summary_what_p2()],
    },
    {
      id: "why-learn-it",
      heading: m.vibe_summary_why_heading(),
      paragraphs: [
        m.vibe_summary_why_p1(),
        m.vibe_summary_why_p2(),
        m.vibe_summary_why_p3(),
      ],
    },
    {
      id: "how-fast-ai-models-improve",
      heading: m.vibe_summary_pace_heading(),
      paragraphs: [
        m.vibe_summary_pace_p1(),
        m.vibe_summary_pace_p2(),
        m.vibe_summary_pace_p3(),
      ],
    },
    {
      id: "start-without-code",
      heading: m.vibe_summary_spectrum_heading(),
      paragraphs: [
        m.vibe_summary_spectrum_p1(),
        m.vibe_summary_spectrum_p2(),
        m.vibe_summary_spectrum_p3(),
        m.vibe_summary_spectrum_p4(),
      ],
    },
    {
      id: "what-is-an-ai-agent",
      heading: m.vibe_summary_agent_heading(),
      paragraphs: [m.vibe_summary_agent_p1(), m.vibe_summary_agent_p2()],
    },
  ] as const

  let activeTab: TabId = "summary"
  let agentSessionsVisited = false
  let activeSectionId: string | null = null
  const viewedSections = new Set<string>()

  function selectTab(
    tabId: TabId,
    options: {
      moveFocus?: boolean
      track?: boolean
      selectionMethod?: "pointer" | "keyboard"
    } = {},
  ) {
    const changed = activeTab !== tabId
    activeTab = tabId
    if (tabId === "agent-sessions") agentSessionsVisited = true

    if (changed && options.track) {
      capture("resource tab selected", {
        ...analyticsContext,
        tab_id: tabId,
        selection_method: options.selectionMethod ?? "pointer",
      })
    }

    if (options.moveFocus) {
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
    selectTab(tabs[nextIndex].id, {
      moveFocus: true,
      track: true,
      selectionMethod: "keyboard",
    })
  }

  function trackSectionViewed(sectionId: string) {
    if (viewedSections.has(sectionId)) return

    viewedSections.add(sectionId)
    capture("content section viewed", {
      ...analyticsContext,
      section_id: sectionId,
      content_type: "workshop_summary",
    })
  }

  function scrollToSection(event: MouseEvent, id: string) {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    activeSectionId = id
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })
    replaceState(`#${id}`, {})
  }

  onMount(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.has("session")) {
      selectTab("agent-sessions")
    }

    const hash = url.hash.slice(1)
    if (summarySections.some((section) => section.id === hash)) {
      selectTab("summary")
      activeSectionId = hash
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView()
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        for (const entry of visible) trackSectionViewed(entry.target.id)
        if (visible[0]) activeSectionId = visible[0].target.id
      },
      { rootMargin: "-80px 0px -60% 0px" },
    )

    for (const section of summarySections) {
      const heading = document.getElementById(section.id)
      if (heading) observer.observe(heading)
    }

    return () => observer.disconnect()
  })
</script>

<Seo title={m.vibe_title()} description={m.vibe_description()} />

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
        onclick={() =>
          capture("outbound link clicked", {
            ...analyticsContext,
            destination_id: "workshop_presentation",
            destination_host: "vibecoding-workshop-gilt.vercel.app",
            placement: "resource_header",
          })}
      >
        {m.vibe_open_presentation()}
        <span class="ml-1.5" aria-hidden="true">↗</span>
      </a>

      <a
        class="text-ink-700 hover:text-ink-900 inline-flex min-h-11 items-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        href="/resources/vibecoding-workshop.pdf"
        download="vibecoding-workshop.pdf"
        onclick={() =>
          capture("asset download clicked", {
            ...analyticsContext,
            asset_id: "vibecoding_workshop_pdf",
            asset_type: "pdf",
            asset_host: "same_origin",
            placement: "resource_header",
          })}
      >
        {m.vibe_download()}
        <span class="ml-1.5" aria-hidden="true">↓</span>
      </a>
    </div>
  </header>

  <div
    class="overflow-hidden rounded-xl border border-[#ffffff14] bg-black shadow-sm"
  >
    <iframe
      class="block aspect-video w-full"
      src="https://vibecoding-workshop-gilt.vercel.app/"
      title={m.vibe_iframe_title()}
      allow="fullscreen"
      allowfullscreen
    ></iframe>
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
      <div
        class="-ml-2.5 flex min-w-max sm:-ml-3"
        role="tablist"
        aria-label={m.vibe_tablist_label()}
      >
        {#each tabs as tab, index}
          <button
            id={`tab-${tab.id}`}
            class="relative min-h-11 shrink-0 px-2.5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:px-3 {activeTab ===
            tab.id
              ? 'text-ink-900'
              : 'text-ink-700 hover:text-ink-900'}"
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabindex={activeTab === tab.id ? 0 : -1}
            onclick={() =>
              selectTab(tab.id, {
                track: true,
                selectionMethod: "pointer",
              })}
            onkeydown={(event) => handleTabKeydown(event, index)}
          >
            {tab.label}
            {#if activeTab === tab.id}
              <span
                class="absolute inset-x-2.5 -bottom-px h-0.5 bg-white sm:inset-x-3"
                aria-hidden="true"
              ></span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <div
      id="panel-summary"
      class="pt-8 pb-12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:pt-10"
      role="tabpanel"
      aria-labelledby="tab-summary"
      tabindex="0"
      hidden={activeTab !== "summary"}
    >
      <div class="flex gap-16">
        <article class="prose max-w-2xl min-w-0">
          <h3 class="text-2xl leading-tight font-black sm:text-3xl">
            {m.vibe_summary_heading()}
          </h3>

          {#each summarySections as section}
            <h4 id={section.id} class="scroll-mt-24 text-lg font-bold">
              {section.heading}
            </h4>
            {#each section.paragraphs as paragraph}
              <p>{paragraph}</p>
            {/each}
          {/each}
        </article>

        <nav
          class="sticky top-28 hidden max-h-[calc(100vh-9rem)] w-56 shrink-0 self-start overflow-y-auto xl:block"
          aria-label={m.vibe_summary_toc_label()}
        >
          <p class="text-ink-900 text-sm font-semibold">
            {m.vibe_summary_toc_label()}
          </p>
          <ul class="mt-3 border-l border-[#ffffff1f]">
            {#each summarySections as section}
              <li>
                <a
                  href={`#${section.id}`}
                  class="-ml-px block border-l py-1.5 pl-4 text-sm leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white {activeSectionId ===
                  section.id
                    ? 'text-ink-900 border-white'
                    : 'text-ink-700 hover:text-ink-900 border-transparent'}"
                  aria-current={activeSectionId === section.id
                    ? "true"
                    : undefined}
                  onclick={(event) => scrollToSection(event, section.id)}
                >
                  {section.heading}
                </a>
              </li>
            {/each}
          </ul>
        </nav>
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
          <section aria-labelledby={`link-group-${group.id}`}>
            <div class="min-h-24 border-b border-[#ffffff1f] pb-5">
              <h3
                id={`link-group-${group.id}`}
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
                    onclick={() =>
                      capture("outbound link clicked", {
                        ...analyticsContext,
                        destination_id: link.destinationId,
                        destination_host: new URL(link.href).hostname,
                        link_group: group.id,
                        placement: "resource_list",
                      })}
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
      class="pt-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:pt-10"
      role="tabpanel"
      aria-labelledby="tab-agent-sessions"
      tabindex="0"
      hidden={activeTab !== "agent-sessions"}
    >
      {#if agentSessionsVisited}
        <AgentSessionViewer />
      {/if}
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
          {m.vibe_qa_heading()}
        </h3>
        <p class="text-ink-700 mt-4 max-w-xl text-base leading-7">
          {m.vibe_qa_body()}
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

<script lang="ts">
  import { onMount } from "svelte"
  import { goto, replaceState } from "$app/navigation"
  import Seo from "$lib/seo.svelte"
  import { m } from "$lib/paraglide/messages"
  import { localizeHref } from "$lib/paraglide/runtime"
  import { manifest } from "$lib/vibecoding/agent-sessions/manifest"

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

  let activeSectionId = $state<string | null>(null)

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
    // Old links used /resources/vibecoding-demo?session=<slug>; forward them
    // to the session's own page.
    const requestedSlug = new URL(window.location.href).searchParams.get(
      "session",
    )
    if (requestedSlug) {
      const known = manifest.sessions.some(
        (session) => session.slug === requestedSlug,
      )
      const target = known
        ? `/resources/vibecoding-demo/agent-sessions/${requestedSlug}`
        : "/resources/vibecoding-demo/agent-sessions"
      void goto(localizeHref(target), { replaceState: true })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0]
        if (visible) activeSectionId = visible.target.id
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

<div class="pt-8 pb-12 sm:pt-10">
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
              aria-current={activeSectionId === section.id ? "true" : undefined}
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

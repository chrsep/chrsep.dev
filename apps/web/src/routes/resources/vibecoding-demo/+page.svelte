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
    <div class="mb-5 max-w-3xl sm:mb-6">
      <h2
        class="text-ink-900 text-3xl leading-tight font-black tracking-tight sm:text-4xl md:text-5xl"
      >
        Workshop resources
      </h2>
      <p class="text-ink-700 mt-3 max-w-2xl text-base leading-7 sm:text-lg">
        Revisit the demo, explore the source, and find every tool used during
        the workshop.
      </p>
    </div>

    <div
      class="tab-scroll -mx-6 overflow-x-auto border-b border-[#ffffff1f] px-6 sm:mx-0 sm:px-0"
    >
      <div
        class="-ml-2.5 flex min-w-max sm:-ml-3"
        role="tablist"
        aria-label="Vibe Coding resources"
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
            onclick={() => selectTab(tab.id)}
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
      class="pt-8 pb-12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:pt-10"
      role="tabpanel"
      aria-labelledby="tab-summary"
      tabindex="0"
      hidden={activeTab !== "summary"}
    >
      <article class="prose max-w-2xl">
        <h3 class="text-2xl leading-tight font-black sm:text-3xl">
          Workshop summary
        </h3>

        <h4 class="text-lg font-bold">What is vibe coding</h4>
        <p>
          Vibe coding means building working software by describing what you
          want in everyday language and letting an AI agent, a program that can
          carry out a task on its own, write and run the code for you. Instead
          of typing code yourself, you describe the outcome you want in plain
          sentences, and the agent produces it.
        </p>
        <p>
          The term itself is very new. It was coined in February 2025, when
          Andrej Karpathy, a founding member of OpenAI, described on Twitter how
          he now codes. He explained that he hands the details over to the agent
          entirely: "give in to the vibes, embrace exponentials, and forget that
          the code even exists." He was describing a new way of working with
          software, one where the person directs and the AI agent executes.
        </p>
        <p>
          Because the term and the practice are this new, almost everyone
          learning vibe coding today started at roughly the same time. There is
          no group of people with a ten year head start. That makes this a
          genuinely good moment to begin.
        </p>

        <h4 class="text-lg font-bold">Why learn it</h4>
        <p>
          AI is changing how software gets made, and the change is already
          visible in how long things take. A prototype, meaning a rough working
          version of an idea, used to take weeks to build. With an AI agent, the
          same prototype can often take shape in hours. People working this way
          report moving something like ten times faster, and the resulting
          software is often higher quality while requiring less manual effort.
        </p>
        <p>
          This is not limited to writing code. The same kind of AI agent is
          useful for research, planning, reporting, analysis, and monitoring,
          essentially most of the work that happens on a computer. Learning to
          work well with an agent today is learning the future of work.
        </p>

        <h4 class="text-lg font-bold">How fast the models improved</h4>
        <p>
          It helps to see the actual pace of change rather than take it on
          faith. A research group called METR (metr.org) measures this in a
          concrete way. They measure the length of the task an AI model can
          complete successfully about half of the time. That duration has been
          doubling roughly every six months.
        </p>
        <p>
          Here is what that progression has looked like in practice. GPT-2
          reached about 3 seconds. GPT-3 reached about 9 seconds. This was the
          era of the Bing chat box: fast answers, but heavy hallucination
          (confidently stated wrong answers) and no real independent work.
          GPT-3.5 reached about 36 seconds, good enough that it started powering
          code autocomplete, the suggestions that appear as a programmer types.
          GPT-4 reached about 4 minutes and could write whole files of code on
          request, but this was still code generation: a system producing text,
          not yet a system managing its own work. GPT-4o, in early 2024, reached
          about 7 minutes.
        </p>
        <p>
          Close to the start of 2025, a model called o3 reached about 2 hours,
          and this is when AI agents in the modern sense appeared: systems that
          can try something, look at the result, plan a next step, and try again
          on their own, until a task is done. This is also the moment Karpathy
          named vibe coding. The improvement has kept going since: GPT-5 reached
          about 3.4 hours, GPT-5.2 about 5.9 hours, and GPT-5.6 Sol is projected
          to reach around 16 hours sometime in 2026. The growth has stayed
          exponential, and there is no sign yet of it slowing down.
        </p>

        <h4 class="text-lg font-bold">You do not need to know code to start</h4>
        <p>
          There is a spectrum of how deeply a person needs to understand code to
          build with AI agents, and it is worth being honest about where each
          end sits.
        </p>
        <p>
          At one end is pure vibe coding: you describe what you want in plain
          words, and the agent handles everything, from writing the code to
          getting it running. This is where this workshop sits, and it is a
          real, working way to build software today, not a toy version of the
          real thing.
        </p>
        <p>
          At the other end is what is sometimes called agentic engineering:
          treating the AI agent as a highly capable coworker that you consult
          and direct, while you personally verify what it produces, plan what it
          should do next, and understand what is happening underneath. Getting
          an application to a production level, meaning stable and reliable
          enough to run for real users and to grow as more people use it, means
          gradually learning those underlying details.
        </p>
        <p>
          What you can build grows with what you understand, and that growth
          happens over time, not all at once. You can start from zero today.
          That is enough to begin, and there is room to grow from there for as
          long as you want to keep going.
        </p>

        <h4 class="text-lg font-bold">What an AI agent actually is</h4>
        <p>
          An AI agent is an AI system that works on its own to complete a task,
          using tools such as a web browser, a command-line terminal (a
          text-based way of controlling a computer), or your files. It works in
          a loop: it tries something, checks the result, adjusts its approach,
          and tries again, repeating until the task is done. Over time it can
          also learn about you and your work and carry that context forward,
          building up a kind of memory.
        </p>
        <p>
          This is different from a chatbot. A chatbot is a single back and
          forth: you send a message, it replies within seconds, and the exchange
          ends there. An agent keeps working after your initial instruction,
          taking multiple steps toward the goal without you supervising every
          one of them. Claude and Codex are both examples of AI agents in this
          sense.
        </p>

        <h4 class="text-lg font-bold">The tools and the architecture</h4>
        <p>
          The live demo used four tools, and seeing how they connect explains
          how a vibe coded application actually reaches the internet. GitHub is
          where the code lives, along with the complete history of every change
          ever made to it. Vercel is the server, meaning the computer that keeps
          the application running around the clock so anyone can reach it at any
          time. Neon is the database, built on a widely used database system
          called Postgres. It is effectively the application's memory, the place
          where its information is stored. Codex is the AI agent that wrote the
          code itself, based on plain language instructions. Put together,
          Vercel pulls the latest code from GitHub and runs it, the running
          application pulls whatever data it needs from Neon, and the finished
          page is sent out to anyone, anywhere, on whatever device they open it
          with.
        </p>

        <h4 class="text-lg font-bold">The live demo, and where to go next</h4>
        <p>
          During the workshop, an inventory application was built live from
          plain language prompts and deployed to the internet, meaning published
          and made reachable by anyone with the link. The source code, the live
          application, and the workshop slides are all in the Links tab of this
          same page.
        </p>
        <p>
          That is really the point of everything above: open an agent such as
          Claude or Codex, and start describing what you want to build. You can
          do that today.
        </p>
      </article>
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

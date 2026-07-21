<script lang="ts">
  import { onMount } from "svelte"
  import { afterNavigate } from "$app/navigation"
  import { m } from "$lib/paraglide/messages"
  import { localizeHref } from "$lib/paraglide/runtime"
  import type {
    SessionManifest,
    SessionSummary,
    SessionTranscript,
  } from "./types"

  let {
    manifest,
    session,
    transcript,
  }: {
    manifest: SessionManifest
    session: SessionSummary
    transcript: SessionTranscript
  } = $props()

  let transcriptEl: HTMLDivElement | null = $state(null)
  let switchEl: HTMLButtonElement | null = $state(null)
  let isMobile = $state(false)
  let menuOpen = $state(false)

  onMount(() => {
    const mediaQuery = window.matchMedia("(max-width: 63.99rem)")
    isMobile = mediaQuery.matches
    const handleMediaChange = (event: MediaQueryListEvent) => {
      isMobile = event.matches
      menuOpen = false
    }
    mediaQuery.addEventListener("change", handleMediaChange)

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange)
    }
  })

  afterNavigate(() => {
    menuOpen = false
    transcriptEl?.scrollTo({ top: 0 })
  })

  function sessionHref(slug: string) {
    return localizeHref(`/resources/vibecoding-demo/agent-sessions/${slug}`)
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    if (!menuOpen || event.key !== "Escape") return
    menuOpen = false
    switchEl?.focus()
  }

  function formatDuration(durationMs: number | null) {
    if (durationMs === null) return null
    if (durationMs < 60_000) return "<1m"

    const totalMinutes = Math.round(durationMs / 60_000)
    if (totalMinutes < 60) return `${totalMinutes}m`

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }

  function messageLabel(role: "user" | "assistant", variant?: string) {
    if (role === "user") return "You"
    return variant === "progress" ? "Agent update" : "Agent response"
  }
</script>

{#snippet sessionList()}
  <ul class="session-list">
    {#each manifest.sessions as item}
      <li>
        <a
          class:active={session.slug === item.slug}
          href={sessionHref(item.slug)}
          aria-current={session.slug === item.slug ? "page" : undefined}
          data-sveltekit-noscroll
        >
          <span>{item.title}</span>
        </a>
      </li>
    {/each}
  </ul>
{/snippet}

<svelte:window onkeydown={handleWindowKeydown} />

<section class="viewer" aria-label="Inventory agent sessions">
  <div class="frame">
    <aside class="session-rail">
      <div class="rail-title">{m.vibe_sessions_title()}</div>
      <div class="rail-project">
        <svg
          class="rail-folder"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-width="1.25"
          stroke-linejoin="round"
        >
          <path
            d="M1.75 4.25c0-.55.45-1 1-1h3.06c.3 0 .59.14.78.37l.82.99c.19.23.47.36.77.36h5.07c.55 0 1 .45 1 1v6.28c0 .55-.45 1-1 1H2.75c-.55 0-1-.45-1-1V4.25Z"
          />
        </svg>
        <span>{manifest.project}</span>
      </div>

      <nav aria-label="Inventory sessions">
        {@render sessionList()}
      </nav>
    </aside>

    <div class="conversation">
      <header class="conversation-heading">
        <div>
          {#if isMobile}
            <h3 id="agent-session-heading">
              <button
                type="button"
                class="session-switch"
                aria-expanded={menuOpen}
                aria-controls="session-menu"
                bind:this={switchEl}
                onclick={() => (menuOpen = !menuOpen)}
              >
                <span class="sr-only">{m.vibe_sessions_picker_label()}: </span>
                <span class="switch-title">{session.title}</span>
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m4.5 6.5 3.5 3.5 3.5-3.5" />
                </svg>
              </button>
            </h3>
          {:else}
            <h3 id="agent-session-heading">{session.title}</h3>
          {/if}
          {#if formatDuration(session.durationMs)}
            <p>{formatDuration(session.durationMs)}</p>
          {/if}
        </div>
        <p class="session-counts">
          {session.messageCount}
          {session.messageCount === 1 ? "message" : "messages"}
          <span aria-hidden="true"> · </span>
          {session.actionCount}
          {session.actionCount === 1 ? "action" : "actions"}
        </p>
        {#if isMobile && menuOpen}
          <div class="session-menu" id="session-menu">
            <div class="rail-project">
              <svg
                class="rail-folder"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linejoin="round"
              >
                <path
                  d="M1.75 4.25c0-.55.45-1 1-1h3.06c.3 0 .59.14.78.37l.82.99c.19.23.47.36.77.36h5.07c.55 0 1 .45 1 1v6.28c0 .55-.45 1-1 1H2.75c-.55 0-1-.45-1-1V4.25Z"
                />
              </svg>
              <span>{manifest.project}</span>
            </div>
            <nav aria-label="Inventory sessions">
              {@render sessionList()}
            </nav>
          </div>
        {/if}
      </header>
      {#if isMobile && menuOpen}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <div class="menu-backdrop" onclick={() => (menuOpen = false)}></div>
      {/if}

      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div
        class="transcript"
        class:centered={transcript.entries.length === 0}
        bind:this={transcriptEl}
        tabindex="0"
        role="region"
        aria-labelledby="agent-session-heading"
      >
        {#if transcript.entries.length === 0}
          <div class="state-message">
            <h3>No published messages</h3>
            <p>
              This session does not contain any reviewed transcript entries yet.
            </p>
          </div>
        {:else}
          <div class="entry-list">
            {#each transcript.entries as entry}
              {#if entry.type === "message"}
                <article
                  class:user-message={entry.role === "user"}
                  class:assistant-message={entry.role === "assistant"}
                  class:progress-message={entry.variant === "progress"}
                  aria-label={messageLabel(entry.role, entry.variant)}
                >
                  <div class="message-content">{@html entry.html}</div>
                </article>
              {:else if entry.type === "activity"}
                {#if entry.details.length > 0}
                  <details class="activity">
                    <summary>
                      <span>{entry.summary}</span>
                      {#if entry.status !== "completed"}
                        <small class:error-status={entry.status === "failed"}
                          >{entry.status}</small
                        >
                      {/if}
                    </summary>
                    <ol>
                      {#each entry.details as detail}
                        <li>
                          <span class="activity-category"
                            >{detail.category}</span
                          >
                          <div>
                            <strong>{detail.label}</strong>
                            {#if detail.description}
                              <p>{detail.description}</p>
                            {/if}
                          </div>
                        </li>
                      {/each}
                    </ol>
                  </details>
                {:else}
                  <div class="activity activity-static">{entry.summary}</div>
                {/if}
              {:else}
                <figure class="session-media">
                  <img
                    src={entry.src}
                    width={entry.width}
                    height={entry.height}
                    alt={entry.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  {#if entry.caption}
                    <figcaption>{entry.caption}</figcaption>
                  {/if}
                </figure>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .viewer {
    --viewer-muted: #929292;
    --hairline: #ffffff14;
    --viewer-canvas: #141414;

    color-scheme: dark;
    width: 100%;
    color: var(--color-ink-900);
  }

  .frame {
    display: grid;
    grid-template-columns: clamp(15rem, 22vw, 17rem) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    height: min(46rem, calc(100vh - 9rem));
    height: min(46rem, calc(100dvh - 9rem));
    min-height: 30rem;
    overflow: hidden;
    background: var(--viewer-canvas);
    border: 1px solid var(--hairline);
    border-radius: 0.75rem;
  }

  .session-rail {
    min-width: 0;
    overflow-y: auto;
    padding: 1.1rem 0.75rem 1.25rem;
    background: var(--color-default-800);
    scrollbar-gutter: stable;
  }

  .rail-title {
    padding: 0 0.5rem 0.85rem;
    color: var(--color-ink-600);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .rail-project {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    padding: 0.35rem 0.5rem;
    color: var(--color-ink-800);
    font-size: 0.85rem;
    font-weight: 500;
  }

  .rail-project svg {
    flex: none;
    color: var(--color-ink-600);
  }

  .rail-project span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  nav {
    padding: 0.15rem 0 0 1.5rem;
  }

  .session-list {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .session-list a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 2.25rem;
    padding: 0.45rem 0.5rem;
    color: var(--color-ink-700);
    text-decoration: none;
    border-radius: 0.5rem;
    transition:
      color 160ms ease-out,
      background-color 160ms ease-out;
  }

  .session-list a:hover {
    color: var(--color-ink-900);
    background: rgb(255 255 255 / 5%);
  }

  .session-list a.active {
    color: var(--color-ink-900);
    background: rgb(255 255 255 / 9%);
  }

  .session-list a span {
    overflow: hidden;
    font-size: 0.83rem;
    font-weight: 500;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .conversation {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    border-left: 1px solid var(--hairline);
  }

  .conversation-heading {
    position: relative;
    z-index: 2;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 0.9rem 1.5rem;
    border-bottom: 1px solid var(--hairline);
  }

  .conversation-heading h3 {
    max-width: 48rem;
    margin: 0;
    overflow-wrap: anywhere;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.35;
    text-wrap: balance;
  }

  .conversation-heading p {
    margin: 0.3rem 0 0;
    color: var(--viewer-muted);
    font-size: 0.75rem;
  }

  .conversation-heading .session-counts {
    flex: none;
    margin: 0;
    white-space: nowrap;
  }

  .session-switch {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: calc(100% + 1rem);
    padding: 0.35rem 0.5rem;
    margin: -0.35rem -0.5rem;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    background: none;
    border: 0;
    border-radius: 0.5rem;
  }

  .session-switch .switch-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .session-switch svg {
    flex: none;
    color: var(--color-ink-600);
    transition: transform 160ms ease-out;
  }

  .session-switch[aria-expanded="true"] svg {
    transform: rotate(180deg);
  }

  .menu-backdrop {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .session-menu {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    z-index: 3;
    max-height: min(24rem, 60vh);
    max-height: min(24rem, 60dvh);
    overflow-y: auto;
    padding: 0.6rem 0.5rem 0.9rem;
    background: var(--color-default-800);
    border-bottom: 1px solid var(--hairline);
    box-shadow: 0 18px 32px rgb(0 0 0 / 45%);
    animation: menu-in 140ms ease-out;
  }

  .session-menu nav {
    padding: 0.25rem 0 0;
  }

  .transcript {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    padding: 2rem 1.5rem 3rem;
    scrollbar-gutter: stable;
  }

  .transcript.centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .entry-list {
    width: 100%;
    max-width: 48rem;
    margin-inline: auto;
  }

  article {
    overflow-wrap: anywhere;
  }

  .user-message {
    width: fit-content;
    max-width: min(70%, 32rem);
    padding: 0.75rem 1rem;
    margin: 0 0 2.5rem auto;
    color: var(--color-ink-900);
    font-size: 0.875rem;
    line-height: 1.55;
    background: var(--color-default-700);
    border-radius: 0.75rem;
  }

  .assistant-message {
    width: 100%;
    margin: 0 0 2rem;
    color: var(--color-ink-700);
    font-size: 0.9rem;
    line-height: 1.7;
  }

  .assistant-message.progress-message {
    color: var(--viewer-muted);
    font-size: 0.82rem;
  }

  .message-content :global(:first-child) {
    margin-top: 0;
  }

  .message-content :global(:last-child) {
    margin-bottom: 0;
  }

  .message-content :global(p) {
    margin: 0.8em 0;
  }

  .message-content :global(h1),
  .message-content :global(h2),
  .message-content :global(h3),
  .message-content :global(h4) {
    margin: 1.5em 0 0.55em;
    color: var(--color-ink-900);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.4;
    text-wrap: pretty;
  }

  .message-content :global(ul),
  .message-content :global(ol) {
    padding-left: 1.25rem;
    margin: 0.8em 0;
  }

  .message-content :global(li + li) {
    margin-top: 0.35em;
  }

  .message-content :global(a) {
    color: var(--color-ink-900);
    text-decoration-color: rgb(255 255 255 / 45%);
    text-underline-offset: 0.2em;
  }

  .message-content :global(code) {
    padding: 0.12rem 0.3rem;
    color: var(--color-ink-900);
    font-size: 0.85em;
    background: var(--color-default-700);
    border-radius: 0.25rem;
  }

  .message-content :global(pre) {
    max-width: 100%;
    overflow-x: auto;
    padding: 0.85rem 1rem;
    color: var(--color-ink-800);
    background: var(--color-default-800);
    border-radius: 0.5rem;
  }

  .message-content :global(pre code) {
    padding: 0;
    background: transparent;
  }

  .message-content :global(blockquote) {
    padding: 0.75rem 0.9rem;
    margin: 1rem 0;
    background: rgb(255 255 255 / 4%);
    border: 1px solid rgb(255 255 255 / 9%);
    border-radius: 0.5rem;
  }

  .message-content :global(table) {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
  }

  .message-content :global(th),
  .message-content :global(td) {
    padding: 0.45rem 0.65rem;
    text-align: left;
    border-bottom: 1px solid rgb(255 255 255 / 10%);
  }

  .activity {
    width: 100%;
    margin: 0 0 2rem;
    color: var(--viewer-muted);
    font-size: 0.78rem;
    border-top: 1px solid rgb(255 255 255 / 9%);
    border-bottom: 1px solid rgb(255 255 255 / 9%);
  }

  .activity summary {
    min-height: 2.75rem;
    padding: 0.78rem 0.15rem;
    cursor: pointer;
  }

  .activity summary > span {
    margin: 0 0.65rem 0 0.3rem;
    color: var(--color-ink-700);
  }

  .activity summary small {
    color: #d7b67a;
    font-size: 0.7rem;
  }

  .activity summary small.error-status {
    color: #f2a7a7;
  }

  .activity ol {
    padding: 0 0 0.8rem;
    margin: 0;
    list-style: none;
  }

  .activity li {
    display: grid;
    grid-template-columns: 4.5rem minmax(0, 1fr);
    gap: 0.7rem;
    padding: 0.55rem 0.25rem;
    border-top: 1px solid rgb(255 255 255 / 7%);
  }

  .activity-category {
    color: var(--viewer-muted);
    font-size: 0.7rem;
  }

  .activity strong {
    display: block;
    color: var(--color-ink-800);
    font-size: 0.76rem;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .activity li p {
    margin: 0.25rem 0 0;
    color: var(--viewer-muted);
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .activity-static {
    padding: 0.8rem 0.15rem;
  }

  .session-media {
    width: 100%;
    margin: 0 0 2rem;
  }

  .session-media img {
    display: block;
    width: auto;
    max-width: 100%;
    height: auto;
    border-radius: 0.6rem;
  }

  .session-media figcaption {
    margin-top: 0.55rem;
    color: var(--viewer-muted);
    font-size: 0.75rem;
    line-height: 1.5;
  }

  .state-message {
    width: min(100%, 30rem);
    text-align: center;
  }

  .state-message h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
  }

  .state-message p {
    margin: 0.55rem 0 0;
    color: var(--color-ink-700);
    font-size: 0.85rem;
    line-height: 1.6;
    text-wrap: pretty;
  }

  :is(a, button, summary):focus-visible {
    outline: 2px solid var(--color-ink-900);
    outline-offset: 2px;
  }

  .session-list a:focus-visible,
  .transcript:focus-visible {
    outline: 2px solid var(--color-ink-900);
    outline-offset: -2px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes menu-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 63.99rem) {
    .frame {
      display: flex;
      flex-direction: column;
      height: min(44rem, calc(100vh - 7rem));
      height: min(44rem, calc(100dvh - 7rem));
      min-height: 26rem;
    }

    .session-rail {
      display: none;
    }

    .conversation {
      flex: 1;
      min-height: 0;
      border-left: 0;
    }

    .conversation-heading {
      align-items: flex-start;
      padding: 0.9rem 1rem;
    }

    .conversation-heading > div {
      flex: 1;
      min-width: 0;
    }

    .conversation-heading h3 {
      max-width: none;
      text-wrap: wrap;
    }

    .conversation-heading .session-counts {
      display: none;
    }

    .transcript {
      padding: 1.5rem 1rem 2.5rem;
    }

    .user-message {
      max-width: 82%;
      margin-bottom: 2rem;
    }

    .activity li {
      grid-template-columns: 4rem minmax(0, 1fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
</style>

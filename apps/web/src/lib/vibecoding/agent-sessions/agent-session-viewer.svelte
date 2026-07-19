<script lang="ts">
  import { replaceState } from "$app/navigation"
  import { onMount, tick } from "svelte"
  import { isSessionManifest, isSessionTranscript } from "./guards"
  import type {
    SessionManifest,
    SessionSummary,
    SessionTranscript,
  } from "./types"

  type ManifestState = "loading" | "ready" | "error" | "empty"
  type TranscriptState = "idle" | "loading" | "ready" | "error" | "empty"

  class PublishedDataError extends Error {}

  export let manifestUrl =
    "/resources/vibecoding-demo/agent-sessions/index.json"

  let manifest: SessionManifest | null = null
  let manifestState: ManifestState = "loading"
  let manifestErrorIsData = false
  let transcript: SessionTranscript | null = null
  let transcriptState: TranscriptState = "idle"
  let transcriptErrorIsData = false
  let selectedSlug = ""
  let invalidSlugMessage = ""
  let liveMessage = ""
  let transcriptScroller: HTMLDivElement | undefined
  let manifestController: AbortController | null = null
  let sessionRequestId = 0
  let destroyed = false

  const transcriptCache = new Map<string, SessionTranscript>()
  const inflightTranscripts = new Map<string, Promise<SessionTranscript>>()
  const transcriptControllers = new Map<string, AbortController>()

  const dateFormatter = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  let selectedSession: SessionSummary | null = null
  $: selectedSession =
    manifest?.sessions.find((session) => session.slug === selectedSlug) ?? null

  onMount(() => {
    void loadManifest()
    window.addEventListener("popstate", handlePopState)

    return () => {
      destroyed = true
      manifestController?.abort()
      transcriptControllers.forEach((controller) => controller.abort())
      window.removeEventListener("popstate", handlePopState)
    }
  })

  async function loadManifest() {
    manifestController?.abort()
    const controller = new AbortController()
    manifestController = controller
    manifestState = "loading"
    manifestErrorIsData = false
    transcriptState = "idle"
    transcript = null
    liveMessage = "Loading Inventory sessions"

    try {
      const response = await fetch(manifestUrl, { signal: controller.signal })
      if (!response.ok) throw new Error("Manifest request failed")

      const data: unknown = await response.json()
      if (!isSessionManifest(data)) {
        throw new PublishedDataError("Invalid session manifest")
      }
      if (destroyed || controller.signal.aborted) return

      manifest = data
      if (data.sessions.length === 0) {
        manifestState = "empty"
        liveMessage = "No Inventory sessions are available"
        return
      }

      manifestState = "ready"
      selectInitialSession(data)
    } catch (error) {
      if (controller.signal.aborted || destroyed) return
      manifest = null
      manifestState = "error"
      manifestErrorIsData = error instanceof PublishedDataError
      liveMessage = "Inventory sessions could not be loaded"
    } finally {
      if (manifestController === controller) manifestController = null
    }
  }

  function selectInitialSession(data: SessionManifest) {
    const requestedSlug = getSessionSlugFromUrl()
    const requestedSession = data.sessions.find(
      (session) => session.slug === requestedSlug,
    )
    const fallbackSession =
      data.sessions.find((session) => session.slug === data.defaultSession) ??
      data.sessions[0]

    if (requestedSlug && !requestedSession) {
      invalidSlugMessage = `That shared session isn't available. Showing ${fallbackSession.title}.`
    } else {
      invalidSlugMessage = ""
    }

    const nextSession = requestedSession ?? fallbackSession
    selectedSlug = nextSession.slug
    syncSessionUrl(nextSession.slug)
    void loadTranscript(nextSession)
  }

  function handlePopState() {
    if (!manifest || manifest.sessions.length === 0) return

    const requestedSlug = getSessionSlugFromUrl()
    const requestedSession = manifest.sessions.find(
      (session) => session.slug === requestedSlug,
    )
    const fallbackSession =
      manifest.sessions.find(
        (session) => session.slug === manifest?.defaultSession,
      ) ?? manifest.sessions[0]

    if (requestedSlug && !requestedSession) {
      invalidSlugMessage = `That shared session isn't available. Showing ${fallbackSession.title}.`
    } else {
      invalidSlugMessage = ""
    }

    const nextSession = requestedSession ?? fallbackSession
    selectSession(nextSession.slug, !requestedSession)
  }

  function selectSession(slug: string, updateUrl = true) {
    const session = manifest?.sessions.find((item) => item.slug === slug)
    if (!session) return

    if (selectedSlug !== slug) invalidSlugMessage = ""
    selectedSlug = slug
    if (updateUrl) syncSessionUrl(slug)

    if (
      transcriptState === "ready" &&
      transcript?.slug === slug &&
      transcriptCache.has(slug)
    ) {
      return
    }

    void loadTranscript(session)
  }

  async function loadTranscript(session: SessionSummary) {
    const requestId = ++sessionRequestId
    transcriptState = "loading"
    transcriptErrorIsData = false
    transcript = null
    liveMessage = `Loading ${session.title}`

    try {
      const data = await getTranscript(session)
      if (destroyed || requestId !== sessionRequestId) return

      transcript = data
      transcriptState = data.entries.length === 0 ? "empty" : "ready"
      liveMessage =
        data.entries.length === 0
          ? `${session.title} has no published messages`
          : `${session.title} loaded`
      await scrollTranscriptToStart(requestId)
    } catch (error) {
      if (destroyed || requestId !== sessionRequestId) return
      transcript = null
      transcriptState = "error"
      transcriptErrorIsData = error instanceof PublishedDataError
      liveMessage = `${session.title} could not be loaded`
    }
  }

  function getTranscript(session: SessionSummary) {
    const cached = transcriptCache.get(session.slug)
    if (cached) return Promise.resolve(cached)

    const inflight = inflightTranscripts.get(session.slug)
    if (inflight) return inflight

    const controller = new AbortController()
    transcriptControllers.set(session.slug, controller)

    const request = (async () => {
      try {
        const response = await fetch(session.dataUrl, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Transcript request failed")

        const data: unknown = await response.json()
        if (!isSessionTranscript(data) || data.slug !== session.slug) {
          throw new PublishedDataError("Invalid session transcript")
        }

        transcriptCache.set(session.slug, data)
        return data
      } finally {
        inflightTranscripts.delete(session.slug)
        transcriptControllers.delete(session.slug)
      }
    })()

    inflightTranscripts.set(session.slug, request)
    return request
  }

  function retryTranscript() {
    if (selectedSession) void loadTranscript(selectedSession)
  }

  function handleSessionSelect(event: Event) {
    const select = event.currentTarget as HTMLSelectElement
    selectSession(select.value)
  }

  function handleSessionLink(event: MouseEvent, slug: string) {
    event.preventDefault()
    selectSession(slug)
  }

  function handleTranscriptKeydown(event: KeyboardEvent) {
    if (!transcriptScroller) return

    const pageDistance = Math.max(80, transcriptScroller.clientHeight * 0.85)
    const distances: Partial<Record<string, number>> = {
      ArrowDown: 48,
      ArrowUp: -48,
      PageDown: pageDistance,
      PageUp: -pageDistance,
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault()
      transcriptScroller.scrollTop =
        event.key === "Home" ? 0 : transcriptScroller.scrollHeight
      return
    }

    const distance = distances[event.key]
    if (distance !== undefined) {
      event.preventDefault()
      transcriptScroller.scrollTop += distance
    }
  }

  function getSessionSlugFromUrl() {
    return new URL(window.location.href).searchParams.get("session")
  }

  function sessionHref(slug: string) {
    if (typeof window === "undefined") {
      return `?session=${encodeURIComponent(slug)}`
    }

    const url = new URL(window.location.href)
    url.searchParams.set("session", slug)
    return `${url.pathname}${url.search}${url.hash}`
  }

  function syncSessionUrl(slug: string) {
    const nextUrl = sessionHref(slug)
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
    if (nextUrl !== currentUrl) {
      replaceState(nextUrl, {})
    }
  }

  async function scrollTranscriptToStart(requestId: number) {
    await tick()
    if (requestId === sessionRequestId && transcriptScroller) {
      transcriptScroller.scrollTop = 0
    }
  }

  function formatDate(value: string) {
    return dateFormatter.format(new Date(value))
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

<section
  class="viewer"
  aria-label="Inventory agent sessions"
  aria-busy={manifestState === "loading" || transcriptState === "loading"}
>
  {#if manifestState === "ready"}
    <div class="mobile-picker">
      <label for="inventory-session-select">Inventory session</label>
      <select
        id="inventory-session-select"
        value={selectedSlug}
        onchange={handleSessionSelect}
      >
        {#each manifest?.sessions ?? [] as session}
          <option value={session.slug}>{session.title}</option>
        {/each}
      </select>
    </div>
  {/if}

  <aside class="session-rail">
    <div class="rail-heading">Inventory</div>

    {#if manifestState === "loading"}
      <div class="rail-skeleton" aria-hidden="true">
        {#each Array(5) as _}
          <span></span>
        {/each}
      </div>
    {:else if manifestState === "ready"}
      <nav aria-label="Inventory sessions">
        <ul>
          {#each manifest?.sessions ?? [] as session}
            <li>
              <a
                class:active={selectedSlug === session.slug}
                href={sessionHref(session.slug)}
                aria-current={selectedSlug === session.slug
                  ? "page"
                  : undefined}
                onclick={(event) => handleSessionLink(event, session.slug)}
              >
                <span>{session.title}</span>
                <small>{formatDate(session.startedAt)}</small>
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
  </aside>

  <div class="conversation">
    {#if selectedSession}
      <header class="conversation-heading">
        <div>
          <h3 id="agent-session-heading">{selectedSession.title}</h3>
          <p>
            {formatDate(selectedSession.startedAt)}
            {#if formatDuration(selectedSession.durationMs)}
              <span aria-hidden="true"> · </span>
              {formatDuration(selectedSession.durationMs)}
            {/if}
          </p>
        </div>
        <p class="session-counts">
          {selectedSession.messageCount}
          {selectedSession.messageCount === 1 ? "message" : "messages"}
          <span aria-hidden="true"> · </span>
          {selectedSession.actionCount}
          {selectedSession.actionCount === 1 ? "action" : "actions"}
        </p>
      </header>
    {:else if manifestState === "loading"}
      <header class="conversation-heading heading-skeleton" aria-hidden="true">
        <span></span>
        <span></span>
      </header>
    {/if}

    {#if invalidSlugMessage}
      <p class="notice" role="status">{invalidSlugMessage}</p>
    {/if}

    <!-- svelte-ignore a11y_no_noninteractive_tabindex (the independently scrollable transcript needs a keyboard focus target) -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions (the transcript handles native scroll keys while focused) -->
    <div
      class="transcript"
      class:centered={manifestState !== "ready" || transcriptState !== "ready"}
      bind:this={transcriptScroller}
      role="region"
      aria-labelledby={selectedSession ? "agent-session-heading" : undefined}
      aria-label={selectedSession ? undefined : "Session viewer status"}
      tabindex="0"
      onkeydown={handleTranscriptKeydown}
    >
      {#if manifestState === "loading"}
        <div class="transcript-skeleton" aria-label="Loading sessions">
          <span class="user-line"></span>
          <span></span>
          <span></span>
          <span class="short-line"></span>
          <span class="activity-line"></span>
          <span></span>
          <span class="short-line"></span>
        </div>
      {:else if manifestState === "error"}
        <div class="state-message" role="alert">
          <h3>Sessions unavailable</h3>
          <p>
            {manifestErrorIsData
              ? "The published session index couldn't be read safely."
              : "The session index couldn't be loaded. Check your connection and try again."}
          </p>
          <button type="button" onclick={() => void loadManifest()}
            >Retry</button
          >
        </div>
      {:else if manifestState === "empty"}
        <div class="state-message">
          <h3>No published sessions</h3>
          <p>Inventory transcripts will appear here after they are reviewed.</p>
        </div>
      {:else if transcriptState === "loading"}
        <div class="transcript-skeleton" aria-label="Loading transcript">
          <span class="user-line"></span>
          <span></span>
          <span></span>
          <span class="short-line"></span>
          <span class="activity-line"></span>
          <span></span>
          <span class="short-line"></span>
        </div>
      {:else if transcriptState === "error"}
        <div class="state-message" role="alert">
          <h3>Session unavailable</h3>
          <p>
            {transcriptErrorIsData
              ? "This published transcript couldn't be read safely."
              : "This transcript couldn't be loaded. Check your connection and try again."}
          </p>
          <button type="button" onclick={retryTranscript}>Retry</button>
        </div>
      {:else if transcriptState === "empty"}
        <div class="state-message">
          <h3>No published messages</h3>
          <p>
            This session does not contain any reviewed transcript entries yet.
          </p>
        </div>
      {:else if transcriptState === "ready" && transcript}
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
                        <span class="activity-category">{detail.category}</span>
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

  <p class="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</p>
</section>

<style>
  .viewer {
    --viewer-muted: #929292;

    color-scheme: dark;
    display: grid;
    grid-template-columns: minmax(13rem, 17rem) minmax(0, 1fr);
    width: 100%;
    height: min(76vh, 52rem);
    min-height: 34rem;
    overflow: hidden;
    color: var(--color-ink-900);
    background: var(--color-default-900);
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 0.75rem;
  }

  .mobile-picker {
    display: none;
  }

  .session-rail {
    min-width: 0;
    overflow-y: auto;
    background: var(--color-default-800);
    border-right: 1px solid rgb(255 255 255 / 10%);
  }

  .rail-heading {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 1.15rem 1rem 0.9rem;
    font-size: 0.95rem;
    font-weight: 700;
    background: var(--color-default-800);
    border-bottom: 1px solid rgb(255 255 255 / 8%);
  }

  nav {
    padding: 0.5rem;
  }

  nav ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  nav a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 3.5rem;
    padding: 0.65rem 0.75rem;
    color: var(--color-ink-700);
    text-decoration: none;
    border-radius: 0.5rem;
    transition:
      color 160ms ease-out,
      background-color 160ms ease-out;
  }

  nav a:hover {
    color: var(--color-ink-900);
    background: rgb(255 255 255 / 5%);
  }

  nav a.active {
    color: var(--color-ink-900);
    background: rgb(255 255 255 / 9%);
  }

  nav a span {
    overflow: hidden;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  nav a small {
    margin-top: 0.25rem;
    color: var(--viewer-muted);
    font-size: 0.72rem;
  }

  .conversation {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    background: #151515;
  }

  .conversation-heading {
    display: flex;
    min-height: 4.75rem;
    flex: none;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 0.9rem 1.25rem;
    border-bottom: 1px solid rgb(255 255 255 / 9%);
  }

  .conversation-heading h3 {
    max-width: 48rem;
    margin: 0;
    overflow-wrap: anywhere;
    font-size: 1rem;
    font-weight: 700;
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

  .notice {
    flex: none;
    padding: 0.65rem 1.25rem;
    margin: 0;
    color: var(--color-ink-800);
    font-size: 0.8rem;
    line-height: 1.45;
    background: rgb(255 255 255 / 5%);
    border-bottom: 1px solid rgb(255 255 255 / 8%);
  }

  .transcript {
    min-width: 0;
    min-height: 0;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 2rem clamp(1rem, 4vw, 3.5rem) 3rem;
    scroll-behavior: smooth;
  }

  .transcript.centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .entry-list {
    width: min(100%, 54rem);
    margin: 0 auto;
  }

  article {
    overflow-wrap: anywhere;
  }

  .user-message {
    width: fit-content;
    max-width: min(82%, 38rem);
    padding: 0.7rem 0.95rem;
    margin: 0 0 2.5rem auto;
    color: var(--color-ink-900);
    font-size: 0.875rem;
    line-height: 1.55;
    background: var(--color-default-700);
    border-radius: 0.75rem;
  }

  .assistant-message {
    max-width: 72ch;
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
    font-weight: 700;
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
    max-width: 72ch;
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
    font-weight: 600;
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
    max-width: 48rem;
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
    font-weight: 700;
  }

  .state-message p {
    margin: 0.55rem 0 0;
    color: var(--color-ink-700);
    font-size: 0.85rem;
    line-height: 1.6;
    text-wrap: pretty;
  }

  .state-message button {
    min-height: 2.75rem;
    padding: 0.55rem 1rem;
    margin-top: 1rem;
    color: var(--color-default-900);
    font: inherit;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    background: var(--color-ink-900);
    border: 0;
    border-radius: 0.5rem;
  }

  .rail-skeleton {
    padding: 0.7rem 0.5rem;
  }

  .rail-skeleton span {
    display: block;
    height: 2.8rem;
    margin-bottom: 0.55rem;
    background: rgb(255 255 255 / 5%);
    border-radius: 0.5rem;
    animation: pulse 1.5s ease-in-out infinite alternate;
  }

  .heading-skeleton {
    display: block;
  }

  .heading-skeleton span,
  .transcript-skeleton span {
    display: block;
    background: rgb(255 255 255 / 7%);
    border-radius: 0.3rem;
    animation: pulse 1.5s ease-in-out infinite alternate;
  }

  .heading-skeleton span:first-child {
    width: 14rem;
    height: 0.9rem;
  }

  .heading-skeleton span:last-child {
    width: 8rem;
    height: 0.65rem;
    margin-top: 0.6rem;
  }

  .transcript-skeleton {
    width: min(100%, 54rem);
    margin: 0 auto;
  }

  .transcript-skeleton span {
    width: 88%;
    height: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .transcript-skeleton .user-line {
    width: min(48%, 20rem);
    height: 2.75rem;
    margin: 0 0 2.8rem auto;
    border-radius: 0.7rem;
  }

  .transcript-skeleton .short-line {
    width: 58%;
  }

  .transcript-skeleton .activity-line {
    width: 72%;
    height: 2.75rem;
    margin: 2rem 0;
  }

  :is(a, button, select, summary, .transcript):focus-visible {
    outline: 2px solid var(--color-ink-900);
    outline-offset: 2px;
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

  @keyframes pulse {
    from {
      opacity: 0.45;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 47.99rem) {
    .viewer {
      display: flex;
      height: min(76vh, 46rem);
      min-height: 31rem;
      flex-direction: column;
    }

    .mobile-picker {
      display: block;
      flex: none;
      padding: 0.75rem;
      background: var(--color-default-800);
      border-bottom: 1px solid rgb(255 255 255 / 10%);
    }

    .mobile-picker label {
      display: block;
      margin: 0 0 0.35rem 0.15rem;
      color: var(--color-ink-700);
      font-size: 0.72rem;
      font-weight: 600;
    }

    .mobile-picker select {
      width: 100%;
      min-height: 2.75rem;
      padding: 0.5rem 2.25rem 0.5rem 0.65rem;
      color: var(--color-ink-900);
      font: inherit;
      font-size: 0.875rem;
      background: var(--color-default-700);
      border: 1px solid rgb(255 255 255 / 14%);
      border-radius: 0.5rem;
    }

    .session-rail {
      display: none;
    }

    .conversation {
      flex: 1;
    }

    .conversation-heading {
      min-height: auto;
      align-items: flex-start;
      padding: 0.85rem 1rem;
    }

    .conversation-heading .session-counts {
      display: none;
    }

    .notice {
      padding-right: 1rem;
      padding-left: 1rem;
    }

    .transcript {
      padding: 1.35rem 1rem 2.5rem;
    }

    .user-message {
      max-width: 88%;
      margin-bottom: 2rem;
    }

    .assistant-message,
    .activity {
      max-width: 100%;
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

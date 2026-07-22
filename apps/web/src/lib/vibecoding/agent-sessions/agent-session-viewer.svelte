<script lang="ts">
  import { replaceState } from "$app/navigation"
  import { onMount } from "svelte"
  import { capture, captureException } from "$lib/analytics"
  import { m } from "$lib/paraglide/messages"
  import { isSessionManifest, isSessionTranscript } from "./guards"
  import type {
    SessionManifest,
    SessionSummary,
    SessionTranscript,
  } from "./types"

  type ManifestState = "loading" | "ready" | "error" | "empty"
  type TranscriptState = "idle" | "loading" | "ready" | "error" | "empty"
  type ContentErrorKind =
    | "http"
    | "network"
    | "invalid_json"
    | "invalid_data"
    | "unknown"
  type LoadSource = "network" | "cache" | "inflight"

  class ContentLoadError extends Error {
    readonly kind: ContentErrorKind
    readonly status: number | "unavailable"

    constructor(
      message: string,
      kind: ContentErrorKind,
      status: number | "unavailable" = "unavailable",
    ) {
      super(message)
      this.name = "ContentLoadError"
      this.kind = kind
      this.status = status
    }
  }

  class PublishedDataError extends ContentLoadError {
    constructor(
      message: string,
      status: number | "unavailable" = "unavailable",
    ) {
      super(message, "invalid_data", status)
      this.name = "PublishedDataError"
    }
  }

  const analyticsContext = {
    content_id: "vibecoding_demo",
    resource_id: "vibecoding_demo",
    app_surface: "workshop_resource",
  } as const

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
  let manifestController: AbortController | null = null
  let sessionRequestId = 0
  let destroyed = false
  let transcriptEl: HTMLDivElement | null = null
  let switchEl: HTMLButtonElement | null = null
  let isMobile = false
  let menuOpen = false
  let manifestHadFailure = false

  const transcriptCache = new Map<string, SessionTranscript>()
  const inflightTranscripts = new Map<string, Promise<SessionTranscript>>()
  const transcriptControllers = new Map<string, AbortController>()
  const transcriptFailures = new Set<string>()
  const readMilestones = new Map<string, Set<number>>()
  const failedMedia = new Set<string>()
  const expandedActivities = new Set<string>()

  let selectedSession: SessionSummary | null = null
  $: selectedSession =
    manifest?.sessions.find((session) => session.slug === selectedSlug) ?? null

  onMount(() => {
    void loadManifest()
    window.addEventListener("popstate", handlePopState)

    const mediaQuery = window.matchMedia("(max-width: 63.99rem)")
    isMobile = mediaQuery.matches
    const handleMediaChange = (event: MediaQueryListEvent) => {
      isMobile = event.matches
      menuOpen = false
    }
    mediaQuery.addEventListener("change", handleMediaChange)
    const transcriptElement = transcriptEl
    transcriptElement?.addEventListener("click", handleTranscriptClick)

    return () => {
      destroyed = true
      manifestController?.abort()
      transcriptControllers.forEach((controller) => controller.abort())
      window.removeEventListener("popstate", handlePopState)
      mediaQuery.removeEventListener("change", handleMediaChange)
      transcriptElement?.removeEventListener("click", handleTranscriptClick)
    }
  })

  function durationSince(startedAt: number) {
    return Math.max(0, Math.round(performance.now() - startedAt))
  }

  function isOffline() {
    return typeof navigator !== "undefined" && navigator.onLine === false
  }

  function errorKind(error: unknown): ContentErrorKind {
    if (error instanceof ContentLoadError) return error.kind
    return "unknown"
  }

  function errorStatus(error: unknown) {
    return error instanceof ContentLoadError ? error.status : "unavailable"
  }

  function isPublishedDataError(error: unknown) {
    return (
      error instanceof ContentLoadError &&
      (error.kind === "invalid_data" || error.kind === "invalid_json")
    )
  }

  function captureLoadCompleted({
    operation,
    status,
    sessionSlug,
    startedAt,
    retry,
    recovered,
    source,
  }: {
    operation: "manifest_load" | "transcript_load"
    status: "ready" | "empty"
    sessionSlug: string
    startedAt: number
    retry: boolean
    recovered: boolean
    source: LoadSource
  }) {
    const properties = {
      ...analyticsContext,
      operation,
      status,
      session_slug: sessionSlug,
      duration_ms: durationSince(startedAt),
      offline: isOffline(),
      retry,
      source,
    }

    capture("content load completed", properties)
    if (recovered) capture("content load recovered", properties)
  }

  function captureLoadException({
    error,
    operation,
    sessionSlug,
    startedAt,
    retry,
  }: {
    error: unknown
    operation: "manifest_load" | "transcript_load"
    sessionSlug: string
    startedAt: number
    retry: boolean
  }) {
    if (errorKind(error) === "network" && isOffline()) {
      capture("resource load failed", {
        ...analyticsContext,
        operation,
        resource_type: "json",
        asset_id:
          operation === "manifest_load"
            ? "agent_session_manifest"
            : "agent_session_transcript",
        asset_host: "same_origin",
        error_kind: "offline",
        session_slug: sessionSlug,
        duration_ms: durationSince(startedAt),
        retry,
      })
      return
    }

    captureException(error, {
      ...analyticsContext,
      operation,
      status: errorStatus(error),
      error_kind: errorKind(error),
      session_slug: sessionSlug,
      duration_ms: durationSince(startedAt),
      offline: isOffline(),
      retry,
    })
  }

  async function responseJson(
    response: Response,
    message: string,
  ): Promise<unknown> {
    try {
      return await response.json()
    } catch {
      throw new ContentLoadError(message, "invalid_json", response.status)
    }
  }

  async function loadManifest(retry = false) {
    const startedAt = performance.now()
    manifestController?.abort()
    const controller = new AbortController()
    manifestController = controller
    manifestState = "loading"
    manifestErrorIsData = false
    transcriptState = "idle"
    transcript = null
    liveMessage = "Loading Inventory sessions"

    try {
      let response: Response
      try {
        response = await fetch(manifestUrl, { signal: controller.signal })
      } catch {
        throw new ContentLoadError("Manifest request failed", "network")
      }
      if (!response.ok) {
        throw new ContentLoadError(
          "Manifest request failed",
          "http",
          response.status,
        )
      }

      const data = await responseJson(response, "Manifest response was invalid")
      if (!isSessionManifest(data)) {
        throw new PublishedDataError(
          "Invalid session manifest",
          response.status,
        )
      }
      if (destroyed || controller.signal.aborted) return

      manifest = data
      if (data.sessions.length === 0) {
        manifestState = "empty"
        liveMessage = "No Inventory sessions are available"
        captureLoadCompleted({
          operation: "manifest_load",
          status: "empty",
          sessionSlug: "not_applicable",
          startedAt,
          retry,
          recovered: manifestHadFailure,
          source: "network",
        })
        manifestHadFailure = false
        return
      }

      manifestState = "ready"
      captureLoadCompleted({
        operation: "manifest_load",
        status: "ready",
        sessionSlug: "not_applicable",
        startedAt,
        retry,
        recovered: manifestHadFailure,
        source: "network",
      })
      manifestHadFailure = false
      selectInitialSession(data)
    } catch (error) {
      if (controller.signal.aborted || destroyed) return
      manifest = null
      manifestState = "error"
      manifestErrorIsData = isPublishedDataError(error)
      liveMessage = "Inventory sessions could not be loaded"
      manifestHadFailure = true
      captureLoadException({
        error,
        operation: "manifest_load",
        sessionSlug: "not_applicable",
        startedAt,
        retry,
      })
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
    if (requestedSlug) {
      capture("agent session selected", {
        ...analyticsContext,
        session_slug: nextSession.slug,
        selection_surface: requestedSession
          ? "deep_link"
          : "deep_link_fallback",
        requested_session_available: Boolean(requestedSession),
      })
    }
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

    menuOpen = false
    transcriptEl?.scrollTo({ top: 0 })
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

  async function loadTranscript(session: SessionSummary, retry = false) {
    const startedAt = performance.now()
    const source: LoadSource = transcriptCache.has(session.slug)
      ? "cache"
      : inflightTranscripts.has(session.slug)
        ? "inflight"
        : "network"
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
      captureLoadCompleted({
        operation: "transcript_load",
        status: data.entries.length === 0 ? "empty" : "ready",
        sessionSlug: session.slug,
        startedAt,
        retry,
        recovered: transcriptFailures.has(session.slug),
        source,
      })
      transcriptFailures.delete(session.slug)
      requestAnimationFrame(trackTranscriptReadDepth)
    } catch (error) {
      if (destroyed || requestId !== sessionRequestId) return
      transcript = null
      transcriptState = "error"
      transcriptErrorIsData = isPublishedDataError(error)
      liveMessage = `${session.title} could not be loaded`
      transcriptFailures.add(session.slug)
      captureLoadException({
        error,
        operation: "transcript_load",
        sessionSlug: session.slug,
        startedAt,
        retry,
      })
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
        let response: Response
        try {
          response = await fetch(session.dataUrl, {
            signal: controller.signal,
          })
        } catch {
          throw new ContentLoadError("Transcript request failed", "network")
        }
        if (!response.ok) {
          throw new ContentLoadError(
            "Transcript request failed",
            "http",
            response.status,
          )
        }

        const data = await responseJson(
          response,
          "Transcript response was invalid",
        )
        if (!isSessionTranscript(data) || data.slug !== session.slug) {
          throw new PublishedDataError(
            "Invalid session transcript",
            response.status,
          )
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

  function retryManifest() {
    capture("content retry clicked", {
      ...analyticsContext,
      operation: "manifest_load",
      status: "error",
      session_slug: "not_applicable",
    })
    void loadManifest(true)
  }

  function retryTranscript() {
    if (!selectedSession) return

    capture("content retry clicked", {
      ...analyticsContext,
      operation: "transcript_load",
      status: "error",
      session_slug: selectedSession.slug,
    })
    void loadTranscript(selectedSession, true)
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    if (!menuOpen || event.key !== "Escape") return
    menuOpen = false
    switchEl?.focus()
  }

  function handleSessionLink(event: MouseEvent, slug: string) {
    event.preventDefault()
    if (selectedSlug !== slug) {
      capture("agent session selected", {
        ...analyticsContext,
        session_slug: slug,
        selection_surface: isMobile ? "mobile_menu" : "desktop_rail",
      })
    }
    selectSession(slug)
  }

  function trackTranscriptReadDepth() {
    if (
      !transcriptEl ||
      transcriptState !== "ready" ||
      !transcript ||
      transcript.slug !== selectedSlug
    ) {
      return
    }

    const depth =
      transcriptEl.scrollHeight <= 0
        ? 0
        : ((transcriptEl.scrollTop + transcriptEl.clientHeight) /
            transcriptEl.scrollHeight) *
          100
    const captured = readMilestones.get(selectedSlug) ?? new Set<number>()

    for (const milestone of [50, 90]) {
      if (depth < milestone || captured.has(milestone)) continue

      captured.add(milestone)
      capture("agent session read", {
        ...analyticsContext,
        session_slug: selectedSlug,
        percent_read: milestone,
      })
    }

    readMilestones.set(selectedSlug, captured)
  }

  function handleActivityToggle(
    event: Event,
    activityIndex: number,
    activitySummary: string,
    status: "completed" | "failed" | "interrupted",
    detailCount: number,
  ) {
    if (!(event.currentTarget as HTMLDetailsElement).open || !selectedSlug)
      return

    const activityId = stableActivityId(`${selectedSlug}:${activitySummary}`)
    const expansionId = `${selectedSlug}:${activityId}`
    if (expandedActivities.has(expansionId)) return
    expandedActivities.add(expansionId)

    capture("agent activity expanded", {
      ...analyticsContext,
      session_slug: selectedSlug,
      activity_id: activityId,
      activity_index: activityIndex,
      activity_status: status,
      detail_count: detailCount,
    })
  }

  function stableActivityId(value: string) {
    let hash = 2166136261
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index)
      hash = Math.imul(hash, 16777619)
    }
    return `activity_${(hash >>> 0).toString(16).padStart(8, "0")}`
  }

  function handleTranscriptClick(event: MouseEvent) {
    if (!(event.target instanceof Element)) return

    const anchor = event.target.closest<HTMLAnchorElement>(
      'a[href^="https://"]',
    )
    if (!anchor) return

    try {
      const url = new URL(anchor.href)
      const normalizedPath = url.pathname.replace(/\/$/, "").toLowerCase()
      const destinationId =
        url.hostname === "github.com" && normalizedPath === "/chrsep/inventory"
          ? "inventory_repository"
          : url.hostname === "inventory-wine-five.vercel.app"
            ? "inventory_demo"
            : "transcript_external"

      capture("outbound link clicked", {
        ...analyticsContext,
        destination_id: destinationId,
        destination_host: url.hostname,
        placement: "agent_transcript",
        category: "transcript_resource",
        session_slug: selectedSlug,
      })
    } catch {
      // Sanitized transcript links are expected to be valid absolute URLs.
    }
  }

  function mediaId(src: string) {
    const fileName = src.split(/[?#]/, 1)[0].split("/").pop()
    return fileName && /^[a-zA-Z0-9._-]+$/.test(fileName) ? fileName : "unknown"
  }

  function handleMediaError(src: string, sessionSlug: string) {
    const assetId = mediaId(src)
    const failureId = `${sessionSlug}:${assetId}`
    if (failedMedia.has(failureId)) return

    failedMedia.add(failureId)
    capture("resource load failed", {
      ...analyticsContext,
      operation: "transcript_media_load",
      resource_type: "image",
      asset_id: assetId,
      asset_host: "same_origin",
      session_slug: sessionSlug,
    })
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
    {#each manifest?.sessions ?? [] as session}
      <li>
        <a
          class:active={selectedSlug === session.slug}
          href={sessionHref(session.slug)}
          aria-current={selectedSlug === session.slug ? "page" : undefined}
          onclick={(event) => handleSessionLink(event, session.slug)}
        >
          <span>{session.title}</span>
        </a>
      </li>
    {/each}
  </ul>
{/snippet}

<svelte:window onkeydown={handleWindowKeydown} />

<section
  class="viewer"
  aria-label="Inventory agent sessions"
  aria-busy={manifestState === "loading" || transcriptState === "loading"}
>
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
        <span>{manifest?.project ?? "Inventory"}</span>
      </div>

      {#if manifestState === "loading"}
        <div class="rail-skeleton" aria-hidden="true">
          {#each Array(5) as _}
            <span></span>
          {/each}
        </div>
      {:else if manifestState === "ready"}
        <nav aria-label="Inventory sessions">
          {@render sessionList()}
        </nav>
      {/if}
    </aside>

    <div class="conversation">
      {#if selectedSession}
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
                  <span class="sr-only"
                    >{m.vibe_sessions_picker_label()}:
                  </span>
                  <span class="switch-title">{selectedSession.title}</span>
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
              <h3 id="agent-session-heading">{selectedSession.title}</h3>
            {/if}
            {#if formatDuration(selectedSession.durationMs)}
              <p>{formatDuration(selectedSession.durationMs)}</p>
            {/if}
          </div>
          <p class="session-counts">
            {selectedSession.messageCount}
            {selectedSession.messageCount === 1 ? "message" : "messages"}
            <span aria-hidden="true"> · </span>
            {selectedSession.actionCount}
            {selectedSession.actionCount === 1 ? "action" : "actions"}
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
                <span>{manifest?.project ?? "Inventory"}</span>
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
      {:else if manifestState === "loading"}
        <header
          class="conversation-heading heading-skeleton"
          aria-hidden="true"
        >
          <span></span>
          <span></span>
        </header>
      {/if}

      {#if invalidSlugMessage}
        <p class="notice" role="status">{invalidSlugMessage}</p>
      {/if}

      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div
        class="transcript ph-no-capture"
        class:centered={manifestState !== "ready" ||
          transcriptState !== "ready"}
        bind:this={transcriptEl}
        data-analytics-mask
        tabindex="0"
        role="region"
        aria-labelledby={selectedSession ? "agent-session-heading" : undefined}
        aria-label={selectedSession ? undefined : "Session viewer status"}
        onscroll={trackTranscriptReadDepth}
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
            <button type="button" onclick={retryManifest}>Retry</button>
          </div>
        {:else if manifestState === "empty"}
          <div class="state-message">
            <h3>No published sessions</h3>
            <p>
              Inventory transcripts will appear here after they are reviewed.
            </p>
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
            {#each transcript.entries as entry, entryIndex}
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
                  <details
                    class="activity"
                    ontoggle={(event) =>
                      handleActivityToggle(
                        event,
                        entryIndex,
                        entry.summary,
                        entry.status,
                        entry.details.length,
                      )}
                  >
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
                    onerror={() => handleMediaError(entry.src, selectedSlug)}
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

  <p class="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</p>
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

  .notice {
    flex: none;
    padding: 0.75rem 1rem;
    margin: 1rem 1.5rem 0;
    color: var(--color-ink-800);
    font-size: 0.8rem;
    line-height: 1.45;
    background: rgb(255 255 255 / 5%);
    border: 1px solid rgb(255 255 255 / 8%);
    border-radius: 0.5rem;
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

  .state-message button {
    min-height: 2.75rem;
    padding: 0.55rem 1rem;
    margin-top: 1rem;
    color: var(--color-default-900);
    font: inherit;
    font-size: 0.85rem;
    font-weight: 500;
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
    width: 100%;
    max-width: 48rem;
    margin-inline: auto;
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

  @keyframes pulse {
    from {
      opacity: 0.45;
    }
    to {
      opacity: 1;
    }
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

    .notice {
      padding: 0.75rem 1rem;
      margin: 1rem 1rem 0;
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

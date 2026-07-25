<script lang="ts">
  import { onMount, type Component } from "svelte"
  import Seo from "$lib/seo.svelte"
  import { m } from "$lib/paraglide/messages"
  import { getLocale } from "$lib/paraglide/runtime"

  // Loaded dynamically so the viewer stays out of every other route's initial
  // JavaScript graph. The SEO audit asserts it remains a dynamic entry.
  let AgentSessionViewer: Component | null = $state(null)

  onMount(async () => {
    const module =
      await import("$lib/vibecoding/agent-sessions/agent-session-viewer.svelte")
    AgentSessionViewer = module.default
  })
</script>

<Seo
  mode="indexable"
  routeId="vibeSessions"
  locale={getLocale()}
  title={m.vibe_sessions_page_title()}
  description={m.vibe_sessions_page_description()}
/>

<div class="pt-8 sm:pt-10">
  {#if AgentSessionViewer}
    <AgentSessionViewer />
  {/if}
</div>

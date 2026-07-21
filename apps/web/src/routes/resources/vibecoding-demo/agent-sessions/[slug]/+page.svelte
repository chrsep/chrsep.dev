<script lang="ts">
  import AgentSessionViewer from "$lib/vibecoding/agent-sessions/agent-session-viewer.svelte"
  import Seo from "$lib/seo.svelte"
  import { m } from "$lib/paraglide/messages"

  let { data } = $props()
</script>

<Seo
  title={m.vibe_session_seo_title({ title: data.session.title })}
  description={m.vibe_session_seo_description({ title: data.session.title })}
/>

<div
  class="pt-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:pt-10"
>
  <AgentSessionViewer
    manifest={data.manifest}
    session={data.session}
    transcript={data.transcript}
  />
</div>

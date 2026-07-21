<script lang="ts">
  import Seo from "$lib/seo.svelte"
  import { m } from "$lib/paraglide/messages"
</script>

<Seo title={m.vibe_qa_seo_title()} description={m.vibe_qa_seo_description()} />

<div class="flex min-h-72 max-w-2xl items-center py-12 sm:py-16">
  <div>
    <h3 class="text-ink-900 text-2xl leading-tight font-black sm:text-3xl">
      {m.vibe_qa_heading()}
    </h3>
    <p class="text-ink-700 mt-4 max-w-xl text-base leading-7">
      {m.vibe_qa_body()}
    </p>
  </div>
</div>

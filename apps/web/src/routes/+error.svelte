<script lang="ts">
  import { page } from "$app/state"
  import ButtonLink from "$lib/button-link.svelte"
  import { m } from "$lib/paraglide/messages"
  import { getLocale, localizeHref } from "$lib/paraglide/runtime"
  import Seo from "$lib/seo.svelte"

  const locale = getLocale()
  const isNotFound = $derived(page.status === 404)
</script>

<Seo
  mode="noindex"
  {locale}
  title={isNotFound ? m.error_title() : m.error_generic_title()}
  description={isNotFound
    ? m.error_description()
    : m.error_generic_description()}
/>

<section
  class="mx-auto flex min-h-[70vh] max-w-[1920px] items-center px-6 py-20 sm:px-8 md:px-32"
>
  <div class="max-w-2xl">
    <p class="text-ink-700 mb-4 text-sm font-bold">{page.status}</p>
    <h1 class="max-w-xl text-4xl leading-tight font-black sm:text-5xl">
      {isNotFound ? m.error_heading() : m.error_generic_heading()}
    </h1>
    <p class="text-ink-700 mt-6 max-w-xl text-lg leading-relaxed">
      {isNotFound ? m.error_body() : m.error_generic_body()}
    </p>
    <ButtonLink href={localizeHref("/")} class="mt-8 !inline-flex">
      {m.error_home()}
      <span aria-hidden="true" class="ml-3">→</span>
    </ButtonLink>
  </div>
</section>

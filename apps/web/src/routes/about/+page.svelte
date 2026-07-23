<script lang="ts">
  import { fade } from "svelte/transition"

  import ButtonLink from "$lib/button-link.svelte"
  import Seo from "$lib/seo.svelte"
  import { m } from "$lib/paraglide/messages"
  import { getLocale } from "$lib/paraglide/runtime"
</script>

<Seo
  mode="indexable"
  routeId="about"
  locale={getLocale()}
  title={m.about_title()}
  description={m.about_description()}
/>

<article in:fade={{ duration: 250 }}>
  <header
    class="relative overflow-hidden border-y border-[#ffffff0D] px-6 py-20 sm:px-8 sm:py-28 md:px-32 lg:py-36"
  >
    <div class="relative z-10 mx-auto max-w-7xl">
      <p class="text-ink-600 mb-4 text-sm font-bold tracking-widest uppercase">
        {m.about_eyebrow()}
      </p>
      <h1
        class="max-w-4xl text-4xl leading-[1.08] font-black sm:text-5xl lg:text-7xl"
      >
        {m.about_heading()}
      </h1>
      <p class="text-ink-700 mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
        {m.about_intro()}
      </p>
    </div>

    <div
      aria-hidden="true"
      class="absolute -right-40 -bottom-80 h-[36rem] w-[36rem] rounded-full bg-blue-700/20 blur-3xl"
    ></div>
  </header>

  <div class="mx-auto max-w-7xl px-6 py-20 sm:px-8 md:px-32 lg:py-28">
    <div class="divide-y divide-[#ffffff14] border-y border-[#ffffff14]">
      <section
        class="grid gap-5 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16"
      >
        <p class="text-ink-600 text-sm font-bold tracking-widest uppercase">
          01
        </p>
        <div>
          <h2 class="text-2xl font-black sm:text-3xl">
            {m.about_build_heading()}
          </h2>
          <p class="text-ink-700 mt-4 max-w-2xl text-lg leading-relaxed">
            {m.about_build_body()}
          </p>
        </div>
      </section>

      <section
        class="grid gap-5 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16"
      >
        <p class="text-ink-600 text-sm font-bold tracking-widest uppercase">
          02
        </p>
        <div>
          <h2 class="text-2xl font-black sm:text-3xl">
            {m.about_work_heading()}
          </h2>
          <p class="text-ink-700 mt-4 max-w-2xl text-lg leading-relaxed">
            {m.about_work_body()}
          </p>
        </div>
      </section>

      <section
        class="grid gap-5 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16"
      >
        <p class="text-ink-600 text-sm font-bold tracking-widest uppercase">
          03
        </p>
        <div>
          <h2 class="text-2xl font-black sm:text-3xl">
            {m.about_values_heading()}
          </h2>
          <p class="text-ink-700 mt-4 max-w-2xl text-lg leading-relaxed">
            {m.about_values_body()}
          </p>
        </div>
      </section>
    </div>

    <section class="py-20 sm:py-28">
      <h2 class="max-w-3xl text-3xl font-black sm:text-5xl">
        {m.about_contact_heading()}
      </h2>
      <p class="text-ink-700 mt-6 max-w-2xl text-lg leading-relaxed">
        {m.about_contact_body()}
      </p>
      <ButtonLink
        href="mailto:hi@chrsep.dev"
        class="group mt-8 !inline-flex w-full sm:w-auto"
      >
        {m.about_contact_cta()}
        <span
          aria-hidden="true"
          class="ml-auto transition-transform duration-200 group-hover:translate-x-2 sm:ml-4"
        >
          →
        </span>
      </ButtonLink>
    </section>
  </div>
</article>

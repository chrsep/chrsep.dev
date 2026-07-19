<script lang="ts">
  import { fade } from "svelte/transition"
</script>

<svelte:head>
  <title>Vibe Coding | Chrisando E. Pramudhita</title>
  <meta name="description" content="Vibe Coding resources by Chrisando." />
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
        class="inline-flex min-h-11 items-center text-sm font-medium text-ink-700 transition-colors hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        href="https://vibecoding-workshop-gilt.vercel.app/"
        target="_blank"
        rel="noreferrer"
      >
        Open presentation <span class="ml-1.5" aria-hidden="true">↗</span>
      </a>

      <a
        class="inline-flex min-h-11 items-center text-sm font-medium text-ink-700 transition-colors hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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

  <p class="text-ink-600 mt-3 text-xs sm:text-sm">
    Click the presentation, then use the arrow keys or Slidev controls to
    navigate.
  </p>
</section>

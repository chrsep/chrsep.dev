<script lang="ts">
  import ProjectTag from "$lib/project-tag.svelte"
  import ProjectLink from "$lib/project-link.svelte"

  export let title: string
  export let description: string

  export let githubLink: string
  export let webLink: string
  export let googlePlayLink: string

  export let saas: boolean
  export let ecommerce: boolean
  export let marketing: boolean
  export let openSource: boolean
  export let app: boolean

  export let heroBg: string
</script>

<article class="mb-4 md:mb-8">
  <div
    class="aspect-w-16 aspect-h-9 bg-red-200 mb-6 rounded-xl sm:rounded-2xl xl:rounded-3xl shadow-lg {heroBg}"
  />

  <ul class="flex flex-wrap mb-4 gap-2">
    {#if saas}
      <ProjectTag name="SaaS" bgColor="bg-red-700" />
    {/if}
    {#if ecommerce}
      <ProjectTag name="E-commerce" bgColor="bg-green-800" />
    {/if}
    {#if marketing}
      <ProjectTag name="Marketing Site" bgColor="bg-yellow-300 !text-black" />
    {/if}
    {#if openSource}
      <ProjectTag name="Open Source" bgColor="bg-blue-700" />
    {/if}
    {#if app}
      <ProjectTag name="App" bgColor="bg-teal-800" />
    {/if}
  </ul>

  <h3 class="mb-1 text-lg font-bold">{title}</h3>
  <p class="text-default-800 max-w-md">{description}</p>

  <ul class="flex gap-x-4 mt-4">
    {#if githubLink}
      <ProjectLink name="GitHub" link={githubLink} icon="/icons/github.svg" />
    {/if}
    {#if webLink}
      <ProjectLink name="Web" link={webLink} icon="/icons/globe.svg" />
    {/if}
    {#if googlePlayLink}
      <ProjectLink name="Google Play" link={googlePlayLink} />
    {/if}
  </ul>
</article>

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
</script>

<article class="rounded-2xl w-full">
  <div class="aspect-w-2 aspect-h-1 bg-red-200 mb-6 rounded-xl" />

  <ul class="flex flex-wrap mb-4 gap-2">
    {#if saas}
      <ProjectTag name="SaaS" bgColor="bg-red-700" />
    {/if}
    {#if ecommerce}
      <ProjectTag name="E-commerce" bgColor="bg-green-700" />
    {/if}
    {#if marketing}
      <ProjectTag name="Marketing Site" bgColor="bg-orange-700" />
    {/if}
    {#if openSource}
      <ProjectTag name="Open Source" bgColor="bg-blue-700" />
    {/if}
    {#if app}
      <ProjectTag name="App" bgColor="bg-teal-700" />
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

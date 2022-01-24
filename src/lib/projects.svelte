<script lang="ts">
  import ProjectTag from "$lib/project-tag.svelte"
  import ProjectLink from "$lib/project-link.svelte"

  export let title: string
  export let description: string

  export let githubLink: string = null
  export let webLink: string = null
  export let googlePlayLink: string = null

  export let saas: boolean = false
  export let ecommerce: boolean = false
  export let marketing: boolean = false
  export let openSource: boolean = false
  export let android: boolean = false
  export let webApp: boolean = false

  export let lighthouse: {
    score: number
    link: string
  } = null

  export let heroBg: string
</script>

<article
  class="sm:mb-4 w-[70vw] sm:w-auto sm:basis-1/2 xl:basis-1/4 flex-shrink-0 snap-center first:ml-6 last:mr-6 sm:first:ml-0 sm:last:mr-0"
>
  <div
    class="aspect-w-3 aspect-h-4 mb-6 rounded-2xl shadow-lg overflow-hidden {heroBg}"
  >
    <slot name="image" />
  </div>

  <ul class="flex flex-wrap mb-4 gap-2">
    {#if saas}
      <ProjectTag name="SaaS" bgColor="bg-red-50 text-red-900" />
    {/if}
    {#if ecommerce}
      <ProjectTag name="E-commerce" bgColor="bg-green-50 text-green-900" />
    {/if}
    {#if marketing}
      <ProjectTag
        name="Marketing Site"
        bgColor="bg-yellow-50 !text-yellow-900"
      />
    {/if}
    {#if openSource}
      <ProjectTag name="Open Source" bgColor="bg-blue-50 text-blue-900" />
    {/if}
    {#if android}
      <ProjectTag name="Android" bgColor="bg-teal-50 text-teal-900" />
    {/if}
    {#if webApp}
      <ProjectTag name="Web Application" bgColor="bg-teal-50 text-teal-900" />
    {/if}
  </ul>

  <div class="prose prose-sm">
    <h3>{title}</h3>
    <p>
      {description}
    </p>
  </div>

  <ul class="flex items-center gap-x-4 mt-4">
    {#if lighthouse}
      <li class="relative w-[36px] h-[36px]">
        <a href={lighthouse.link} target="_blank" rel="noreferrer">
          <p
            class="flex items-center justify-center absolute inset-0 text-xs text-green-50 shadow-sm border-3 border-[#34D399] rounded-full"
          >
            {lighthouse.score}
          </p>
        </a>
      </li>
    {/if}
    {#if githubLink}
      <ProjectLink name="GitHub" link={githubLink} />
    {/if}
    {#if webLink}
      <ProjectLink name="Web" link={webLink} />
    {/if}
    {#if googlePlayLink}
      <ProjectLink name="Google Play" link={googlePlayLink} />
    {/if}
  </ul>
</article>

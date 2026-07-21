<script lang="ts">
  import Image from "$lib/image.svelte"
  import { posthog } from "$lib/posthog"

  type ImageMeta = { src: string; width: number; format: string }

  let {
    title,
    description,
    tag,
    href,
    image,
    imageAlt = "",
    analyticsId,
  }: {
    title: string
    description: string
    tag: string
    href: string
    image: ImageMeta[] | ImageMeta
    imageAlt?: string
    analyticsId: string
  } = $props()

  function trackClick() {
    posthog.capture("content item clicked", {
      content_id: analyticsId,
      content_title: title,
      content_type: tag,
      location: "home notes and resources",
    })
  }
</script>

<li class="border-t border-[#ffffff14] last:border-b">
  <a
    class="group -mx-3 grid min-h-32 grid-cols-[7rem_minmax(0,1fr)] items-start gap-4 px-3 py-5 transition-colors duration-200 ease-out hover:bg-[#ffffff08] focus-visible:bg-[#ffffff08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none sm:min-h-36 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-6 sm:py-6 lg:grid-cols-[12rem_minmax(0,1fr)_auto] lg:gap-8"
    {href}
    onclick={trackClick}
  >
    <div
      class="aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-orange-50"
    >
      <Image
        meta={image}
        sizes="(min-width: 1024px) 192px, (min-width: 640px) 160px, 112px"
        alt={imageAlt}
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] group-focus-visible:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
      />
    </div>

    <div class="min-w-0">
      <span
        class="mb-2 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs leading-none font-medium text-orange-950 lg:hidden"
      >
        {tag}
      </span>
      <h3 class="text-ink-900 text-xl leading-snug font-bold">
        {title}
      </h3>
      <p class="text-ink-700 mt-2 max-w-2xl text-base leading-7">
        {description}
      </p>
    </div>

    <span
      class="hidden shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs leading-none font-medium text-orange-950 lg:inline-flex"
    >
      {tag}
    </span>
  </a>
</li>

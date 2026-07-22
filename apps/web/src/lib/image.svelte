<script lang="ts">
  import { capture } from "$lib/analytics"

  type Meta = { src: string; width: number; format: string }

  let {
    resourceId,
    meta,
    sizes,
    alt,
    loading,
    class: className,
  }: {
    resourceId: string
    meta: Meta[] | Meta
    sizes?: string
    alt: string
    loading?: "lazy" | "eager"
    class?: string
  } = $props()

  let loadFailureCaptured = false

  const metaArray = $derived<Meta[]>(Array.isArray(meta) ? meta : [meta])

  const sources = $derived.by(() => {
    const map = new Map<string, Meta[]>()
    for (const m of metaArray) {
      const list = map.get(m.format) ?? []
      list.push(m)
      map.set(m.format, list)
    }
    return map
  })

  const fallback = $derived.by(() => {
    const format = [...sources.keys()].slice(-1)[0]
    return sources.get(format)![0]
  })

  const resolvedSizes = $derived(sizes ?? `${fallback.width}px`)

  function handleImageError() {
    if (loadFailureCaptured) return
    loadFailureCaptured = true

    capture("resource load failed", {
      content_id: "home",
      operation: "load",
      resource_type: "image",
      asset_id: resourceId,
      retryable: true,
      error_type: "image_load_error",
    })
  }
</script>

<picture>
  {#each [...sources.entries()] as [format, list] (format)}
    <source
      sizes={resolvedSizes}
      type="image/{format}"
      srcset={list.map((m) => `${m.src} ${m.width}w`).join(", ")}
    />
  {/each}
  <img
    src={fallback.src}
    {alt}
    {loading}
    class={className}
    onerror={handleImageError}
  />
</picture>

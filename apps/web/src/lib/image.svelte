<script lang="ts">
  type Meta = { src: string; width: number; format: string }

  let {
    meta,
    sizes,
    alt,
    loading,
    class: className,
  }: {
    meta: Meta[] | Meta
    sizes?: string
    alt: string
    loading?: "lazy" | "eager"
    class?: string
  } = $props()

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
</script>

<picture>
  {#each [...sources.entries()] as [format, list] (format)}
    <source
      sizes={resolvedSizes}
      type="image/{format}"
      srcset={list.map((m) => `${m.src} ${m.width}w`).join(", ")}
    />
  {/each}
  <img src={fallback.src} {alt} {loading} class={className} />
</picture>

<script lang="ts">
  /**
   * the output of a vite-imagetools import, using the `meta` query for output
   * format
   */
  export let meta: { src: string; width: number; format: string }[]
  // if there is only one, vite-imagetools won't wrap the object in an array
  if (!(meta instanceof Array)) meta = [meta]

  // all images by format
  let sources = new Map<string, typeof meta>()
  meta.map((m) => sources.set(m.format, []))
  meta.map((m) => sources.get(m.format).push(m))

  // fallback image: first resolution of last format
  let image = sources.get([...sources.keys()].slice(-1)[0])[0]

  export let sizes = `${image.width}px`
  export let alt: string
  export let loading: string = undefined
  let clazz: string = undefined
  export { clazz as class }
</script>

<picture>
  {#each [...sources.entries()] as [format, meta]}
    <source
      {sizes}
      type="image/{format}"
      srcset={meta.map((m) => `${m.src} ${m.width}w`).join(", ")}
    />
  {/each}
  <img src={image.src} {alt} {loading} class={clazz} />
</picture>

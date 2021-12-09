<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import createGlobe from "cobe"
  import { fade } from "svelte/transition"

  let phi = 2
  let canvas: HTMLCanvasElement
  let globe: any

  onMount(async () => {
    if (window.getComputedStyle(canvas, null).display !== "none") {
      globe = createGlobe(canvas, {
        width: 1400,
        height: 1400,
        theta: -0.5,
        dark: true,
        diffuse: 1.9,
        mapSamples: 14000,
        mapBrightness: 7,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [1, 0.2, 0.2],
        glowColor: [1, 1, 1],
        markers: [{ location: [-6.2922, 106.6655], size: 0.05 }],
        onRender: (state) => {
          // Called on every animation frame.
          // `state` will be an empty object, return updated params.
          state.phi = phi
          phi += 0.0004
        },
      })
    }
  })

  onDestroy(() => {
    globe?.destroy()
  })
</script>

<canvas
  in:fade={{ duration: 2000, delay: 300 }}
  bind:this={canvas}
  width="1400"
  height="1800"
  class="absolute -z-0 -bottom-[110%] left-0 xl:-bottom-150 xl:left-auto xl:-right-140 hidden xl:block"
/>

<p
  in:fade={{ duration: 2000, delay: 300 }}
  class="text-sm absolute bottom-0 right-0 z-1 p-4 text-gray-500 hidden xl:block"
>
  Globe by
  <a
    href="https://github.com/shuding/cobe"
    class="hover:text-white transition"
    target="_blank"
    rel="noreferrer"
  >
    @shuding
  </a>
</p>

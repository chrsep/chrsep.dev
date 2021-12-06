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
        devicePixelRatio: window.devicePixelRatio,
        width: 1400,
        height: 1400,
        phi: 0,
        theta: -0.5,
        dark: true,
        diffuse: 1.2,
        mapSamples: 26000,
        mapBrightness: 4,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [1, 0.2, 0.2],
        glowColor: [1, 1, 1],
        markers: [{ location: [-6.2922, 106.6655], size: 0.05 }],
        onRender: (state) => {
          // Called on every animation frame.
          // `state` will be an empty object, return updated params.
          state.phi = phi
          phi += 0.0006
        },
        onLoad: () => {
          console.log("loaded")
        },
      })
    }
  })

  onDestroy(() => {
    globe?.destroy()
  })
</script>

<canvas
  transition:fade={{ duration: 3000 }}
  bind:this={canvas}
  width="1400"
  height="1800"
  class="absolute -z-0 -bottom-[110%] left-0 xl:-bottom-110 xl:left-auto xl:-right-110 hidden xl:block"
/>

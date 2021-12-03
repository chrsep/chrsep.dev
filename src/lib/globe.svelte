<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import createGlobe from "cobe"
  import { fade } from "svelte/transition"

  let phi = 2
  let canvas: HTMLCanvasElement
  let globe: any

  onMount(async () => {
    console.log(canvas)
    if (!canvas.hidden) {
      globe = createGlobe(canvas, {
        width: 1400,
        height: 1400,
        phi: 0,
        theta: -0.3,
        dark: true,
        diffuse: 1.2,
        mapSamples: 20000,
        mapBrightness: 3,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [0, 0.2, 1],
        glowColor: [1, 1, 1],
        markers: [{ location: [-6.2922, 106.6655], size: 0.04 }],
        onRender: (state) => {
          // Called on every animation frame.
          // `state` will be an empty object, return updated params.
          state.phi = phi
          phi += 0.0008
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

  let className = ""
  export { className as class }
</script>

<canvas
  transition:fade={{ duration: 2000 }}
  bind:this={canvas}
  width="1400"
  height="1400"
  class="absolute -z-0 -bottom-110 -right-110 opacity-40 hidden lg:block"
/>

<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import createGlobe from "cobe"
  import { fade } from "svelte/transition"

  let canvas: HTMLCanvasElement | undefined = $state()
  let globe: { update: (s: Record<string, unknown>) => void; destroy: () => void } | undefined
  let frame: number | undefined

  onMount(() => {
    if (!canvas) return
    if (window.getComputedStyle(canvas, null).display === "none") return

    let phi = 2
    globe = createGlobe(canvas, {
      devicePixelRatio: window.devicePixelRatio || 1,
      width: 1500,
      height: 1500,
      phi,
      theta: -0.5,
      dark: 1,
      diffuse: 1.9,
      mapSamples: 14000,
      mapBrightness: 7,
      baseColor: [0.7, 0.7, 0.7],
      markerColor: [1, 0.2, 0.2],
      glowColor: [1, 1, 1],
      markers: [{ location: [-6.2922, 106.6655], size: 0.05 }],
    })

    const tick = () => {
      phi += 0.0006
      globe?.update({ phi })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  })

  onDestroy(() => {
    if (frame !== undefined) cancelAnimationFrame(frame)
    globe?.destroy()
  })
</script>

<canvas
  in:fade={{ duration: 2000, delay: 300 }}
  bind:this={canvas}
  width="1500"
  height="1500"
  class="absolute -bottom-[110%] left-0 -z-0 hidden xl:-bottom-[95%] xl:left-auto xl:-right-[600px] xl:block"
></canvas>

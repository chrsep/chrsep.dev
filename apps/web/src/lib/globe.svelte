<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import createGlobe from "cobe"
  import { fade } from "svelte/transition"
  import { captureException } from "$lib/analytics"

  let canvas: HTMLCanvasElement | undefined = $state()
  let globe:
    | { update: (s: Record<string, unknown>) => void; destroy: () => void }
    | undefined
  let frame: number | undefined
  let failureCaptured = false

  function reportFailure(error: unknown, stage: string) {
    if (failureCaptured) return
    failureCaptured = true
    captureException(error, {
      component: "globe",
      stage,
    })
  }

  onMount(() => {
    if (!canvas) return
    if (window.getComputedStyle(canvas, null).display === "none") return

    let phi = 2
    try {
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
    } catch (error) {
      reportFailure(error, "render_initialization")
      return
    }

    const tick = () => {
      try {
        phi += 0.0006
        globe?.update({ phi })
      } catch (error) {
        reportFailure(error, "animation_frame")
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  })

  onDestroy(() => {
    if (frame !== undefined) cancelAnimationFrame(frame)
    try {
      globe?.destroy()
    } catch (error) {
      reportFailure(error, "destroy")
    }
  })
</script>

<canvas
  in:fade={{ duration: 2000, delay: 300 }}
  bind:this={canvas}
  width="1500"
  height="1500"
  class="absolute -bottom-[110%] left-0 -z-0 hidden xl:-right-[600px] xl:-bottom-[95%] xl:left-auto xl:block"
></canvas>

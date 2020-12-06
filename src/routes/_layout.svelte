<script lang="ts">
  import Nav from "../components/Nav.svelte"

  export let segment: string
</script>

<link rel="stylesheet" href="index.css" />

<Nav {segment} />

<main>
  <slot />
</main>

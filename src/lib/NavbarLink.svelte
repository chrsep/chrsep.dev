<script lang="ts">
  import { page } from "$app/stores"

  export let href: string
  export let text: string

  $: active = $page.path.includes(href)
</script>

<a {href}
   class:active
   class="ml-auto font-bold hover:underline opacity-60 hover:opacity-100 transition-opacity duration-100 ease-in-out">
  {text}
</a>

<style>
  .active {
      @apply opacity-100 underline text-primary-text;
  }
</style>

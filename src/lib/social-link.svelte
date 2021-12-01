<script lang="ts">
  export let href: string
  export let icon: string
  export let text: string
</script>

<a
  {href}
  class="text-sm flex items-center mr-6 transition-opacity opacity-60 hover:opacity-100"
  target="_blank"
>
  <img src={icon} class="w-4 h-4 mr-2" alt="" />
  {text}
</a>

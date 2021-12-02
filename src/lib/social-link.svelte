<script lang="ts">
  export let href: string
  export let icon: string
  export let text: string

  let className: string

  export { className as class }
</script>

<a
  {href}
  class="text-sm flex items-center transition-opacity opacity-60 hover:opacity-100 {className}"
  target="_blank"
>
  <img src={icon} class="w-4 h-4 mr-2 object-cover" alt="" />
  {text}
</a>

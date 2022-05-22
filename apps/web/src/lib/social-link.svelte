<script lang="ts">
  import Icon from "./icon.svelte"

  export let href: string
  export let text: string
  export let icon: string

  let className: string = ""
  export { className as class }
</script>

<li>
  <a
    {href}
    class="flex items-center text-sm font-medium opacity-40 transition-opacity hover:opacity-100 {className}"
    target="_blank"
    rel="noreferrer"
  >
    <Icon class="mr-1 h-4 w-4 object-cover" --src="url({icon})" />
    {text}
  </a>
</li>

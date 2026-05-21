<script lang="ts">
  import Icon from "./icon.svelte"

  let {
    href,
    text,
    icon,
    class: className = "",
  }: {
    href: string
    text: string
    icon: string
    class?: string
  } = $props()
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

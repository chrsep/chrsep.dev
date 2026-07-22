<script lang="ts">
  import Icon from "./icon.svelte"

  let {
    href,
    text,
    icon,
    class: className = "",
    onclick,
  }: {
    href: string
    text: string
    icon: string
    class?: string
    onclick?: (event: MouseEvent) => void
  } = $props()
</script>

<li>
  <a
    {href}
    class="flex min-h-11 items-center text-sm font-medium opacity-70 transition-opacity hover:opacity-100 {className}"
    target="_blank"
    rel="noreferrer"
    {onclick}
  >
    <Icon class="mr-1 h-4 w-4 object-cover" --src="url({icon})" />
    {text}
  </a>
</li>

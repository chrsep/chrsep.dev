<script lang="ts">
  import Icon from "$lib/icon.svelte"
  export let link: string
  export let name: string
</script>

<li class="text-sm font-bold opacity-60 transition-opacity hover:opacity-100">
  <a href={link} class="flex items-center" rel="noreferrer" target="_blank">
    <Icon --src="url('/icons/link.svg')" class="mr-1" />{name}
  </a>
</li>

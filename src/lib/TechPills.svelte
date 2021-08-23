<script lang="ts">
  import Icon from "$lib/Icon.svelte";

  export let text: string;
  export let web: string;
  export let icon: string;
  export let ringHoverClass: string;
  export let iconGroupHoverClass: string;
</script>

<li class="flex-shrink-0 mb-2">
  <a href={web}
     class="border border-white rounded-lg text-xs sm:px-4 px-3 sm:py-3 py-2 border-opacity-20 mr-2 hover:ring-2 {ringHoverClass} transition flex items-center group"
     target="_blank">
    <Icon --icon-src="url('{icon}')" class="mr-3 !w-[16px] !h-[16px] {iconGroupHoverClass} transition" />
    {text}
  </a>
</li>

<style windi:global>
</style>

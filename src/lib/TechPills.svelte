<script lang="ts">
  import Icon from "$lib/Icon.svelte";

  export let text: string;
  export let web: string;
  export let icon: string;
</script>

<li class="flex-shrink-0 mb-2">
  <a href={web}
     class="border rounded-lg text-xs sm:px-4 px-3 sm:py-3 py-2 border-opacity-30 mr-2 hover:border-blue-300 transition flex items-center"
     target="_blank">
    <Icon --icon-src="url('{icon}')" class="mr-3 w-[16px] h-[16px]" />
    {text}
  </a>
</li>

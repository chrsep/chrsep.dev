<script lang="ts">
  export let text: string;
  export let icon: string;
  export let web: string;
</script>

<a href={web} class="border  rounded-lg text-sm px-4 py-2 border-opacity-20 mr-2 hover:border-blue-300 transition" target="_blank">
  {text}
</a>

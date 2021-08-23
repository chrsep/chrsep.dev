<script lang="ts">
  let className: string;

  export let href: string;
  export let icon: string;
  export let text: string;

  export { className as class };
</script>

<a href="{href}" class="text-sm flex items-center mr-6 opacity-70 {className}" target="_blank">
  <img src="{icon}" class="w-4 h-4 mr-2" alt="" /> {text}
</a>

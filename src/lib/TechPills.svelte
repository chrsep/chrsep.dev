<script lang="ts">
  export let text;
  export let web;
  // export const icon: string;
</script>

<li class="flex-shrink-0 mb-2">
  <a href={web}
     class="border rounded-lg text-sm px-4 py-2 border-opacity-30 mr-2 hover:border-blue-300 transition block"
     target="_blank">
    {text}
  </a>
</li>

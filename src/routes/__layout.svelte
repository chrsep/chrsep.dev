<script>
  import "@fontsource/inter/variable.css"
  import "virtual:windi.css"
</script>

<nav
  class="text-sm flex items-center gap-4 sm:gap-8 text-default-900 w-full mx-auto max-w-[1920px] px-6 sm:px-8 md:px-32 py-6 fixed top-0 inset-x-0 z-10 border-b border-[#ffffff0D] blur bg-default-900 bg-opacity-85 backdrop-filter backdrop-blur"
>
  <a href="/" class="font-bold mr-auto">@chrsep</a>
  <a
    href="/about"
    class=" font-medium text-default-800 hover:text-default-900 transition-colors"
  >
    About
  </a>
  <a
    href="/resume"
    class="font-medium text-default-800 hover:text-default-900 transition-colors"
  >
    Resume
  </a>
</nav>

<main class="text-default-900 min-h-screen">
  <slot />
</main>

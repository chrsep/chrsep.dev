<script>
  import "@fontsource/inter/variable.css"
  import "virtual:windi.css"
</script>

<nav
  class="text-sm  h-17 flex gap-4 sm:gap-8 text-default-900 w-full mx-auto max-w-[1920px] px-6 sm:px-8 md:px-32 fixed top-0 inset-x-0 z-10 border-b border-[#ffffff0D] blur bg-default-900 bg-opacity-85 backdrop-filter backdrop-blur"
>
  <a href="/" class="flex items-center h-full font-bold mr-auto group">
    <div class="overflow-hidden h-5">
      <div
        class="transform sm:group-hover:-translate-y-1/2 transition-transform duration-500 ease-in-out "
      >
        @chrsep<br />
        🏠 <span class="ml-1">Chrisando E. Pramudhita</span>
      </div>
    </div>
  </a>
  <a
    href="/about"
    class=" font-medium text-default-700 hover:text-default-900 transition-colors h-full flex items-center"
  >
    About
  </a>
  <a
    href="/resume"
    class="font-medium text-default-700 hover:text-default-900 transition-colors h-full flex items-center"
  >
    Resume
  </a>
</nav>

<main class="text-default-900 min-h-screen">
  <slot />
</main>

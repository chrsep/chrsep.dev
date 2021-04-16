<script>
  import NavbarLink from "./NavbarLink.svelte"
</script>
<nav
  class="sticky top-0 max-w mx-auto px-6 py-4 border-b flex bg-white bg-opacity-50 backdrop-filter backdrop-blur items-center"
>
  <a href="/">
    <p class="font-bold text-xl">chrsep.dev</p>
  </a>

  <NavbarLink href="/about" text="About" />

  <a
    href="https://github.com/chrsep"
    class="bg-white ring ring-gray-300 ring-1 rounded p-2 block ml-6 hover hover:ring-2 hover:ring-primary transition duration-200 ease-in-out"
  >
    <img src="/icons/brand-github.svg" class="w-5" />
  </a>
</nav>

<script lang="ts">
  import "@fontsource/inter/variable.css"
  import GithubIcon from "$icons/github.svg"
  import StackOverflowIcon from "$icons/stackoverflow.svg"
  import TwitterIcon from "$icons/twitter.svg"
  import LinkedinIcon from "$icons/linkedin.svg"
  import Button from "$lib/button.svelte"

  import "virtual:windi.css"
</script>

<nav
  class="text-sm h-12 sm:h-16 flex gap-4 sm:gap-8 text-default-900 w-full mx-auto max-w-[1920px] px-6 sm:px-8 md:px-32 fixed top-0 inset-x-0 z-10 border-b border-[#ffffff0D] blur bg-default-900 bg-opacity-80 backdrop-filter backdrop-blur"
>
  <a href="/" class="flex items-center h-full font-bold mr-auto group">
    <div class="overflow-hidden h-5">
      <div
        class="transform sm:group-hover:-translate-y-1/2 transition-transform duration-500 ease-in-out"
      >
        <span class="font-black text-xs sm:text-sm">
          @chrsep
          <span class="text-default-700 text-xs">(WIP)</span>
        </span><br />
        🏠 <span class="ml-1">Chrisando E. Pramudhita</span>
      </div>
    </div>
  </a>

  <a
    href="/cv"
    class="font-medium text-default-700 hover:text-default-900 transition-colors h-full flex items-center"
  >
    CV
  </a>
</nav>

<main class="text-default-900 min-h-screen">
  <slot />
</main>

<footer
  class="border-t pb-6 pt-12 sm:py-12 sm:py-16 border-[#ffffff0D] text-default-900 mt-32"
>
  <div
    class="mx-auto max-w-[1920px] px-6 sm:px-8 md:px-32 flex flex-col sm:flex-row sm:items-end"
  >
    <div>
      <h1 class="font-black leading-tight text-xl md:text-2xl">
        Let's work together!
      </h1>
      <p class="text-default-800 my-4 sm:mb-0 max-w-sm opacity-70">
        I would love to help you build faster and more accessible websites.
      </p>
      <a
        href="mailto:hi@chrsep.dev"
        class="inline-block w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4 mt-2 sm:mt-6"
      >
        <Button class="w-full sm:w-auto group text-sm">
          Get in touch
          <span
            class="transition-transform transform mr-1 group-hover:translate-x-2 ease-in-out duration-200 ml-auto sm:ml-3"
          >
            ->
          </span>
        </Button>
      </a>
    </div>

    <div class="sm:ml-auto mt-12 mx-2">
      <h2 class="mb-5 font-bold text-default-700">Chrisando Eka Pramudhita</h2>

      <a
        href="mailto:hi@chrsep.dev"
        class="flex items-center text-default-900 opacity-40 font-medium hover:opacity-100 transition"
      >
        <svg
          class="w-4 h-4 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        hi@chrsep.dev
      </a>

      <ul class="mt-4 flex gap-4 items-center -ml-2">
        <li>
          <a
            href="https://github.com/chrsep"
            class="flex items-center opacity-40 hover:opacity-100 hover:ring-2 ring-white rounded-lg p-2 transition ease-in-out duration-200"
          >
            <GithubIcon class="w-4 h-4" />
          </a>
        </li>
        <li>
          <a
            href="https://linkedin.com/in/chrsep"
            class="flex items-center opacity-40 hover:opacity-100 hover:ring-2 ring-white rounded-lg p-2 transition ease-in-out duration-200"
          >
            <LinkedinIcon class="w-4 h-4" />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/_chrsep"
            class="flex items-center opacity-40 hover:opacity-100 hover:ring-2 ring-white rounded-lg p-2 transition ease-in-out duration-200"
          >
            <TwitterIcon class="w-4 h-4" />
          </a>
        </li>
        <li>
          <a
            href="https://stackoverflow.com/users/story/6656573"
            class="flex items-center opacity-40 hover:opacity-100 hover:ring-2 ring-white rounded-lg p-2 transition ease-in-out duration-200"
          >
            <StackOverflowIcon class="w-4 h-4" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</footer>

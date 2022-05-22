<script lang="ts">
  import "@fontsource/inter/variable.css"
  import GithubIcon from "$icons/github.svg"
  import StackOverflowIcon from "$icons/stackoverflow.svg"
  import TwitterIcon from "$icons/twitter.svg"
  import LinkedinIcon from "$icons/linkedin.svg"
  import Button from "$lib/button.svelte"

  import "../app.css"
  import ButtonLink from "$lib/button-link.svelte"
</script>

<nav
  class="fixed inset-x-0 top-0 z-10 h-12 w-full bg-default-900 bg-opacity-80 px-6 text-sm text-default-900 backdrop-blur-lg backdrop-filter sm:h-16 sm:px-8 md:px-32 "
>
  <div class="mx-auto flex h-12 max-w-[1920px] gap-4 sm:h-16 sm:gap-8 ">
    <a href="/" class="group mr-auto flex h-full items-center font-bold">
      <div class="h-5 overflow-hidden">
        <div
          class="transform transition-transform duration-500 ease-in-out sm:group-hover:-translate-y-1/2"
        >
          <span class="text-xs font-black sm:text-sm">
            @chrsep
          </span><br />
          🏠 <span class="ml-1">Chrisando E. Pramudhita</span>
        </div>
      </div>
    </a>

    <a
      href="/cv"
      class="flex h-full items-center font-medium text-default-700 transition-colors hover:text-default-900"
    >
      CV
    </a>
  </div>
</nav>

<main class="mt-12 min-h-screen text-default-900 sm:mt-16">
  <slot />
</main>

<footer
  class="mt-32 border-t border-[#ffffff0D] pb-6 pt-12 text-default-900 sm:py-12 sm:py-16"
>
  <div
    class="mx-auto flex max-w-[1920px] flex-col px-6 sm:flex-row sm:items-end sm:px-8 md:px-32"
  >
    <div>
      <h1 class="text-xl font-black leading-tight md:text-2xl">
        Let's work together!
      </h1>
      <p class="my-4 max-w-sm text-default-800 opacity-70 sm:mb-0">
        I would love to help you build faster and more accessible websites.
      </p>
      <ButtonLink
        href="mailto:hi@chrsep.dev"
        class="group mb-4 mt-2 !inline-block w-full text-sm sm:mb-0 sm:mr-4 sm:mt-6 sm:w-auto"
      >
        Get in touch
        <span
          class="mr-1 ml-auto transform transition-transform duration-200 ease-in-out group-hover:translate-x-2 sm:ml-3"
        >
          ->
        </span>
      </ButtonLink>
    </div>

    <div class="mt-12 sm:ml-auto">
      <a
        href="mailto:hi@chrsep.dev"
        class="flex items-center font-medium text-default-900 opacity-40 transition hover:opacity-100"
      >
        <svg
          class="mr-3 h-4 w-4"
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

      <ul class="mt-4 -ml-2 flex items-center gap-4">
        <li>
          <a
            href="https://github.com/chrsep"
            class="flex items-center rounded-lg p-2 opacity-40 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
          >
            <GithubIcon class="h-4 w-4" />
          </a
          >
        </li>
        <li>
          <a
            href="https://linkedin.com/in/chrsep"
            class="flex items-center rounded-lg p-2 opacity-40 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
          >
            <LinkedinIcon class="h-4 w-4" />
          </a
          >
        </li>
        <li>
          <a
            href="https://twitter.com/_chrsep"
            class="flex items-center rounded-lg p-2 opacity-40 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
          >
            <TwitterIcon class="h-4 w-4" />
          </a
          >
        </li>
        <li>
          <a
            href="https://stackoverflow.com/users/story/6656573"
            class="flex items-center rounded-lg p-2 opacity-40 ring-white transition duration-200 ease-in-out hover:opacity-100 hover:ring-2"
          >
            <StackOverflowIcon class="h-4 w-4" />
          </a
          >
        </li>
      </ul>
    </div>
  </div>
</footer>

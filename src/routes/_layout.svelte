<script lang="ts">
  import Sun from "../icons/other/sun.svg"
  import Moon from "../icons/other/moon.svg"

  let darkMode = false

  function handleToggleTheme() {
    darkMode = !darkMode
  }

  export let segment: string
</script>

<div class:dark={darkMode}>
  <div class="bg-white dark:bg-black">
    <nav>
      <ul class="flex item-center">
        <li class="m-3">
          <a aria-current={segment === undefined ? "page" : undefined} href="."
            >Home</a
          >
        </li>
        <li class="m-3">
          <a
            aria-current={segment === "about" ? "page" : undefined}
            href="about">About</a
          >
        </li>

        <li class="m-3 ml-auto">
          <button on:click={handleToggleTheme}>
            {#if darkMode}
              <img alt="switch to light mode" src={Sun} />
            {:else}
              <img alt="switch to dark mode" src={Moon} />
            {/if}
          </button>
        </li>
      </ul>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</div>

<script context="module">
  export function preload() {
    return this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => {
        return { posts }
      })
  }
</script>

<script>
  export let posts
</script>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<ul class="m-3">
  {#each posts as post}
    <!-- we're using the non-standard `rel=prefetch` attribute to
        tell Sapper to load the data for the page as soon as
        the user hovers over the link or taps it, instead of
        waiting for the 'click' event -->
    <li class="text-md hover:underline">
      <a rel="prefetch" href="blog/{post.slug}" class="prose dark:prose-light">
        <h1>
          {post.title}
        </h1>
      </a>
    </li>
  {/each}
</ul>

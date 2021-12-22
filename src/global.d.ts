/// <reference path="@sveltejs/kit" />
declare module "cobe" {
  export default function createGlobe(
    canvas: HTMLCanvasElement,
    options?: any
  ): any
}

declare module "*.svg" {
  import { SvelteComponentTyped } from "svelte"
  export default class extends SvelteComponentTyped<{class: string}> {}
}

declare module "*.svg?component" {
  import { SvelteComponentTyped } from "svelte"
  export default class extends SvelteComponentTyped<{class: string}> {}
}

declare module "*.svg?src" {
  const content: string
  export default content
}

declare module "*.svg?url" {
  const content: string
  export default content
}

/// <reference types="@sveltejs/kit" />

declare const __APP_ENVIRONMENT__: string
declare const __APP_RELEASE__: string

interface ImportMetaEnv {
  readonly PUBLIC_POSTHOG_KEY?: string
  readonly PUBLIC_POSTHOG_HOST?: string
  readonly PUBLIC_POSTHOG_ENVIRONMENT?: string
  readonly PUBLIC_POSTHOG_DISABLED?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace App {
  interface Error {
    message: string
  }
}

declare module "*.svg" {
  import type { Component } from "svelte"
  const Svg: Component<{ class?: string }>
  export default Svg
}

declare module "*.svg?component" {
  import type { Component } from "svelte"
  const SvgComponent: Component<{ class?: string }>
  export default SvgComponent
}

declare module "*.svg?src" {
  const svgSrc: string
  export default svgSrc
}

declare module "*.svg?url" {
  const svgUrl: string
  export default svgUrl
}

declare module "*&as=metadata" {
  type ImageMeta = { src: string; width: number; format: string }
  const meta: ImageMeta | ImageMeta[]
  export default meta
}

declare module "@fontsource-variable/inter"

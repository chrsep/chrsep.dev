/// <reference types="@sveltejs/kit" />

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

declare module "*.woff2?url" {
  const fontUrl: string
  export default fontUrl
}

declare module "*&as=metadata" {
  type ImageMeta = {
    src: string
    width: number
    height: number
    format: string
  }
  const meta: ImageMeta | ImageMeta[]
  export default meta
}

declare module "@fontsource-variable/inter"

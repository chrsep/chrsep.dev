/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import { toTheme } from "@theme-ui/typography"
// @ts-ignore
import alton from "typography-theme-alton"
import merge from "deepmerge"
import { Theme } from "theme-ui"

export default merge(toTheme(alton), {
  useColorSchemeMediaQuery: true,
} as Theme)

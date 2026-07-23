import { defineConfig } from "vite-plus"

export default defineConfig({
  run: {
    tasks: {
      "build:cv": {
        command: "xelatex --output-directory=out cv.tex",
        cache: true,
        output: ["out/**"],
      },
    },
  },
})

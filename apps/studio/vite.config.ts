import { defineConfig } from "vite-plus"

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: "./node_modules/.bin/sanity build ./dist -y",
        cache: true,
        output: ["dist/**"],
      },
    },
  },
})

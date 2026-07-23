import { cp, mkdir, rm } from "node:fs/promises"

const source = new URL("../../studio/dist/", import.meta.url)
const destination = new URL("../static/studio/", import.meta.url)

await rm(destination, { force: true, recursive: true })
await mkdir(destination, { recursive: true })
await cp(source, destination, { recursive: true })

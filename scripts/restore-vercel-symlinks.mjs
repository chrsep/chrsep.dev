import {
  lstat,
  mkdir,
  readFile,
  readlink,
  realpath,
  rm,
  symlink,
} from "node:fs/promises"
import { dirname, relative, resolve } from "node:path"

const outputDirectory = resolve(".vercel/output")
const manifestPath = resolve(".svelte-kit/vite-plus-vercel-symlinks.json")
const symlinks = JSON.parse(await readFile(manifestPath, "utf8"))

for (const entry of symlinks) {
  const linkPath = resolve(outputDirectory, entry.path)
  const relativeLinkPath = relative(outputDirectory, linkPath)

  if (
    relativeLinkPath.startsWith("..") ||
    relativeLinkPath.includes("\0") ||
    resolve(linkPath) === outputDirectory
  ) {
    throw new Error(`Invalid cached symlink path: ${entry.path}`)
  }

  await mkdir(dirname(linkPath), { recursive: true })

  try {
    const stats = await lstat(linkPath)

    if (stats.isSymbolicLink() && (await readlink(linkPath)) === entry.target) {
      continue
    }

    await rm(linkPath, { force: true, recursive: true })
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error
    }
  }

  await symlink(entry.target, linkPath)
}

for (const entry of symlinks) {
  await realpath(resolve(outputDirectory, entry.path))
}

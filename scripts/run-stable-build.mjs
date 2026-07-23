import { spawnSync } from "node:child_process"
import { mkdir, readlink, readdir, writeFile } from "node:fs/promises"
import { dirname, join, relative, resolve } from "node:path"

const [command, ...args] = process.argv.slice(2)

if (!command) {
  throw new Error("A build command is required")
}

const forwardedVariables = [
  "CI",
  "FORCE_COLOR",
  "HOME",
  "LANG",
  "LC_ALL",
  "LOGNAME",
  "NODE_ENV",
  "NODE_OPTIONS",
  "NO_COLOR",
  "PATH",
  "PUBLIC_POSTHOG_HOST",
  "PUBLIC_POSTHOG_KEY",
  "PUBLIC_POSTHOG_UI_HOST",
  "SANITY_STUDIO_DATASET",
  "SANITY_STUDIO_PROJECT_ID",
  "SHELL",
  "TERM",
  "TMPDIR",
  "TZ",
  "USER",
]

const stableEnvironment = {}

for (const name of forwardedVariables) {
  const value = process.env[name]

  if (value !== undefined) {
    stableEnvironment[name] = value
  }
}

async function collectSymlinks(root, directory, symlinks) {
  let entries

  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error) {
    if (error.code === "ENOENT") {
      return
    }

    throw error
  }

  for (const entry of entries) {
    const entryPath = join(directory, entry.name)

    if (entry.isSymbolicLink()) {
      symlinks.push({
        path: relative(root, entryPath),
        target: await readlink(entryPath),
      })
    } else if (entry.isDirectory()) {
      await collectSymlinks(root, entryPath, symlinks)
    }
  }
}

const result = spawnSync(command, args, {
  env: stableEnvironment,
  stdio: "inherit",
})

if (result.error) {
  throw result.error
}

if (result.signal) {
  process.kill(process.pid, result.signal)
}

if (result.status === 0) {
  const outputDirectory = resolve(".vercel/output")
  const symlinks = []

  await collectSymlinks(outputDirectory, outputDirectory, symlinks)

  if (symlinks.length > 0) {
    const manifestPath = resolve(".svelte-kit/vite-plus-vercel-symlinks.json")

    await mkdir(dirname(manifestPath), { recursive: true })
    await writeFile(manifestPath, `${JSON.stringify(symlinks, null, 2)}\n`)
  }
}

process.exit(result.status ?? 1)

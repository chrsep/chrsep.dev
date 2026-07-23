import { spawnSync } from "node:child_process"

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

process.exit(result.status ?? 1)

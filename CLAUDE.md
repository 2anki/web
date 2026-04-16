# Project guidance for Claude

## Package manager

Use `pnpm`, not `npm` or `yarn`. The lockfile is `pnpm-lock.yaml` and `packageManager` is pinned in `package.json`. Examples: `pnpm install`, `pnpm build`, `pnpm test`, `pnpm remove <dep>`.

## Dev server

Never start the dev server yourself. When a task needs a running server (visual checks, manual testing), ask the user to run `pnpm dev` and report back. The user keeps the server running on their side.

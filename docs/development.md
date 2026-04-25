# Development

Fluent is an Electron and React app built with Vite.

## Requirements

- Node.js 22.12.0 or newer.
- npm 10 or newer.

Use the version in `.nvmrc` when possible.

## Setup

```sh
npm install
```

## Local Development

```sh
npm run dev
```

This starts Vite on `127.0.0.1:5173` and opens Electron against the local dev server.

## Quality Gates

```sh
npm run check
```

The full check runs:

- TypeScript type checking.
- ESLint, including React hooks and JSX accessibility rules.
- Markdown linting.
- Prettier format check.
- Production Vite build.
- High-severity production dependency audit.

Use focused commands while developing:

```sh
npm run typecheck
npm run lint
npm run lint:md
npm run format:check
npm run build
npm run audit:prod
```

## Packaging

```sh
npm run package
```

This builds the renderer and creates an unpacked Electron app in `release/`.

```sh
npm run dist
```

This builds distributable unsigned artifacts for the current platform.

## Formatting

```sh
npm run format
```

Formatting is intentionally automated so pull requests do not spend review time on style drift.

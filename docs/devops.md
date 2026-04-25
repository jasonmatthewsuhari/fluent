# DevOps

Fluent uses GitHub Actions and CodeRabbit to catch severe mistakes before merge and to publish nightly pre-alpha builds.

## Pull Request Gates

The `CI` workflow runs on every pull request and push to `main`.

It blocks on:

- TypeScript type errors.
- ESLint failures.
- JSX accessibility lint failures.
- Markdown lint failures.
- Prettier format drift.
- Production build failures.
- High-severity production dependency advisories.

The `Dependency Review` workflow blocks high-severity production dependency advisories with `npm audit`. GitHub's native dependency-review action also runs and comments on dependency diffs when the repository Dependency Graph is enabled.

The `CodeQL` workflow scans JavaScript and TypeScript for security issues.

## CodeRabbit

CodeRabbit is configured through `.coderabbit.yaml`.

It reviews pull requests with an assertive profile and pays special attention to:

- Accessibility regressions.
- Unsafe Electron or IPC changes.
- Desktop automation safety.
- Secret handling and provider-key privacy.
- GitHub Actions security.
- Overclaiming in public docs.

Custom pre-merge checks are configured for accessibility risk, automation safety, and secrets/privacy.

## Nightly Release

The `Nightly Release` workflow runs daily and can be triggered manually.

It builds unsigned pre-alpha artifacts for:

- Windows.
- macOS.
- Linux.

The workflow replaces the `nightly` prerelease on GitHub with the latest artifacts and release notes.

Nightly builds are for testing only. They are not signed, notarized, or ready for dependable assistive use.

## Supply Chain Hygiene

Dependabot opens weekly pull requests for:

- npm dependencies.
- GitHub Actions.

OpenSSF Scorecard runs weekly and uploads SARIF results to GitHub code scanning.

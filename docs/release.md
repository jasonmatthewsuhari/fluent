# Release Process

Fluent does not have stable releases yet. Until the first public prototype, releases should be treated as development snapshots.

## Nightly Builds

The `Nightly Release` workflow publishes a moving `nightly` prerelease from `main`.

Nightly artifacts are:

- Unsigned.
- Pre-alpha.
- Intended for contributor and tester feedback.
- Not suitable for daily assistive workflows.

## Pre-Release Checklist

- Run `npm run check`.
- Confirm the app starts with `npm run dev`.
- Confirm `npm run dist` creates artifacts on the target platform.
- Review user-facing copy for accessibility and safety claims.
- Confirm no local notes, API keys, screenshots, or research drafts are committed.
- Update README status if the release changes what users can try.

## Versioning

Use semantic versioning after the first public build:

- Patch: bug fixes and documentation-only release notes.
- Minor: new user-facing features or supported workflows.
- Major: breaking configuration, automation, provider, or data-handling changes.

## Release Notes

Release notes should call out:

- New workflows.
- Accessibility changes.
- Safety and confirmation behavior.
- Provider or data-flow changes.
- Known limitations.

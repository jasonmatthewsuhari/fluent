# Contributing to Fluent

Fluent is an early open-source project for accessible desktop control. Contributions should improve reliability, safety, accessibility, or clarity for people who may not be able to use a computer through traditional input.

## Working Principles

- Treat accessibility as a core requirement, not polish.
- Keep the first version focused on the text-driven agent loop.
- Make automation behavior visible and interruptible.
- Prefer small, reviewable pull requests.
- Avoid adding new product scope without an issue or discussion first.

## Good First Contributions

- Improve documentation and examples.
- Add accessibility review notes.
- Prototype focused UI components.
- Research OS automation APIs.
- Add tests around agent planning, safety policy, or provider handling.
- Improve setup, packaging, and developer tooling.

## Pull Requests

Before opening a pull request:

1. Link the pull request to an existing GitHub issue. If no issue exists, open one first so the scope and context are visible.
2. Check existing issues and pull requests for overlap.
3. Keep changes focused on one topic.
4. Explain the user-facing behavior change.
5. Include tests or describe why tests are not practical yet.
6. Note any accessibility impact.

For UI work, include screenshots or short recordings when possible.

## Accessibility Expectations

User-facing changes should consider:

- Keyboard access.
- Visible focus states.
- Large hit targets.
- High contrast.
- Text resizing.
- Reduced motion.
- Clear error and status messages.
- Behavior that does not depend on color alone.

If a change creates an accessibility tradeoff, call it out in the pull request.

## Security and Privacy

Fluent may handle AI provider keys, screenshots, app context, and desktop automation permissions. Treat these areas carefully.

- Do not log secrets.
- Do not send user data to external services without explicit behavior in code and documentation.
- Prefer local-first handling where possible.
- Report vulnerabilities through the process in [SECURITY.md](SECURITY.md).

## Development Status

Fluent is pre-alpha. APIs, architecture, and product decisions will change as the first implementation takes shape.

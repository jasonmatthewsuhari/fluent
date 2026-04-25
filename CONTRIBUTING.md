# Contributing to Fluent

Fluent is an open-source Electron desktop AI agent for accessible computer control. It is for people who need alternatives to traditional mouse and keyboard use, including disabled users, elders, and people in rehabilitation.

This guide explains how to make a first pull request, how to work in the codebase, and what Fluent expects from contributors. It is intentionally detailed because accessibility, safety, and desktop automation work all need more care than a typical app contribution.

## Contents

- [Project priorities](#project-priorities)
- [Contributor conduct](#contributor-conduct)
- [Good first contributions](#good-first-contributions)
- [Before you start](#before-you-start)
- [Make your first PR](#make-your-first-pr)
- [Local development](#local-development)
- [Pull request expectations](#pull-request-expectations)
- [SDK-first architecture rules](#sdk-first-architecture-rules)
- [Accessibility requirements](#accessibility-requirements)
- [Safety and privacy requirements](#safety-and-privacy-requirements)
- [Documentation contributions](#documentation-contributions)
- [AI-assisted contributions](#ai-assisted-contributions)
- [Review process](#review-process)
- [Maintainer notes](#maintainer-notes)
- [Reference material](#reference-material)

## Project Priorities

Fluent is pre-alpha. The first validation pass is text input only. The point of the first pass is to prove the agent loop before adding voice, camera, gesture, switch access, eye tracking, or other input modes.

When choosing what to work on, prefer contributions that improve:

- Text-driven intent capture.
- Agent planning and observable progress.
- Confirmation, pause, stop, and safety policy.
- OS automation through a clear platform bridge.
- User-supplied AI provider support without leaking secrets.
- Accessibility, especially keyboard access, readable state, large targets, clear focus, and low cognitive load.
- Documentation that helps new contributors make correct, focused changes.

Avoid broad product expansion until the SDK boundaries are in place. The Electron app is the first client of the SDK, not the owner of the agent logic.

## Contributor Conduct

Follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Fluent is built for people whose access needs may differ from your own. Treat lived experience, assistive technology feedback, and accessibility barriers as product-critical information.

When discussing accessibility:

- Do not ask people to disclose health details they have not volunteered.
- Do not frame an access need as an edge case.
- Prefer plain, specific language over vague labels.
- Assume good faith, but prioritize user safety and access when there is a conflict.

## Good First Contributions

Good first PRs are small, reviewable, and useful without requiring a large architectural decision.

Recommended first contributions:

- Improve docs, examples, checklists, or setup instructions.
- Add missing accessibility notes to an issue or PR.
- Fix copy that is unclear, ambiguous, or too technical for a user-facing flow.
- Improve keyboard navigation or focus visibility in an isolated component.
- Add a mocked UI state that makes agent progress, blocked states, or confirmation clearer.
- Add tests around a narrow behavior once the test framework is available.
- Research a specific OS automation API and document tradeoffs.

Avoid as a first PR:

- Replacing the app architecture.
- Adding a new AI provider without discussing provider boundaries first.
- Adding hidden automation behavior.
- Adding telemetry, screenshots, external requests, or storage of sensitive data without a design discussion.
- Large visual redesigns that do not start from the Fluent accessibility requirements.

## Before You Start

1. Read the current project docs:
   - [README.md](README.md)
   - [docs/vision.md](docs/vision.md)
   - [docs/architecture.md](docs/architecture.md)
   - [docs/accessibility-principles.md](docs/accessibility-principles.md)
   - [docs/frontend-plan.md](docs/frontend-plan.md)
   - [SECURITY.md](SECURITY.md)

2. Check existing GitHub issues and pull requests for overlap.

3. Make sure your work has a linked GitHub issue before opening a pull request. If no issue exists, open one first so the scope, motivation, and acceptance criteria are visible.

4. For anything larger than a narrow fix, comment on the issue before implementation. This is especially important for SDK boundaries, automation behavior, provider handling, safety policy, or UI workflow changes.

5. Keep your first PR small. A focused PR with one clear improvement is more likely to be reviewed quickly and merged correctly.

## Make Your First PR

This section assumes you are contributing through a fork. If you have write access to the repository, create a branch directly in the repo instead.

### 1. Fork And Clone

Fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/fluent.git
cd fluent
```

Add the main repository as `upstream`:

```bash
git remote add upstream https://github.com/jasonmatthewsuhari/fluent.git
git fetch upstream
```

Check that both remotes exist:

```bash
git remote -v
```

### 2. Create A Branch

Start from the latest `main`:

```bash
git checkout main
git pull upstream main
```

Create a branch with a descriptive name:

```bash
git checkout -b docs/improve-contributing-guide
```

Useful branch prefixes:

- `docs/` for documentation.
- `fix/` for bug fixes.
- `feat/` for user-facing features.
- `a11y/` for accessibility improvements.
- `sdk/` for SDK or agent-core work.
- `automation/` for OS automation bridge work.
- `chore/` for tooling and maintenance.

### 3. Install Dependencies

Use Node.js and npm. If the repo later adds an `.nvmrc`, `.node-version`, or package manager lockfile, follow that file.

```bash
npm install
```

### 4. Run The App

Start the Electron development app:

```bash
npm run dev
```

This runs Vite on `127.0.0.1:5173` and launches Electron against that local dev server.

### 5. Make A Small Change

For your first PR, change one thing:

- One documentation page.
- One component state.
- One accessibility fix.
- One focused bug.
- One small architecture helper with a clear owner.

Do not mix unrelated fixes. If you notice other issues, open follow-up issues or separate PRs.

### 6. Check Your Work

Run the current required local check:

```bash
npm run build
```

If you changed UI, also run the app manually:

```bash
npm run dev
```

For UI changes, verify at minimum:

- Keyboard navigation works.
- Focus is visible.
- Text remains readable at larger zoom or text settings.
- Buttons and controls have large enough hit targets.
- Important state does not depend on color alone.
- Stop, pause, confirmation, or blocked states are still understandable where relevant.

### 7. Commit

Check the diff:

```bash
git status
git diff
```

Commit with a short, specific message:

```bash
git add CONTRIBUTING.md
git commit -m "docs: expand contributor guide"
```

Good commit messages:

- `docs: add first PR workflow`
- `a11y: improve command input focus state`
- `fix: preserve provider key validation error`
- `sdk: add action proposal type`

Avoid vague messages:

- `update`
- `changes`
- `fix stuff`
- `wip`

### 8. Push And Open The PR

Push your branch:

```bash
git push origin docs/improve-contributing-guide
```

Open a pull request against `main`.

In the PR description:

- Explain what changed.
- Explain why it matters.
- Link the issue with `Closes #123`, `Fixes #123`, or `Refs #123`.
- List what you tested.
- Note accessibility impact.
- Note safety and privacy impact.
- Include screenshots or recordings for UI changes.

## Local Development

Current scripts:

```bash
npm run dev
npm run build
npm run preview
```

`npm run dev` starts the Electron development workflow.

`npm run build` runs TypeScript checking with `tsc --noEmit` and builds the Vite app.

`npm run preview` serves the production Vite build locally. Use it after `npm run build` when you need to inspect the built frontend.

The repo does not currently expose separate lint, format, or test scripts. Do not claim a PR passed lint or tests unless those commands exist and you ran them. When those scripts are added, this guide should be updated.

## Pull Request Expectations

A good Fluent PR is:

- Linked to a GitHub issue that explains the problem or proposed change.
- Focused on one problem.
- Small enough to review without guessing intent.
- Clear about user-facing behavior.
- Clear about accessibility impact.
- Clear about safety, privacy, and automation impact.
- Backed by local checks or an honest explanation of why a check is not available.

### PR Size

Prefer small PRs. Large PRs are acceptable only when a change cannot be split without hiding the design. If a PR is large, explain the boundaries in the description.

Good splits:

- SDK type definitions first, UI integration later.
- Documentation first, implementation later.
- Mocked UI state first, live provider integration later.
- Automation interface first, platform-specific bridge later.

Bad splits:

- UI, SDK, provider storage, automation, and docs all in one PR.
- Formatting unrelated files while changing behavior.
- Moving files and changing logic in the same diff without a strong reason.

### PR Description Template

Use the repository PR template. At minimum, include:

```markdown
## Summary

What changed, and what user-facing behavior does it affect?

## Accessibility

Keyboard, focus, readable text, reduced motion, status, and assistive technology impact.

## Safety and Privacy

Automation permissions, AI provider keys, screenshots, local storage, and external requests.

## Testing

Commands and manual checks performed.
```

### Screenshots And Recordings

Include screenshots or short recordings for UI work, especially when the change affects:

- Focus states.
- Confirmation prompts.
- Agent activity timeline.
- Provider setup.
- Permissions setup.
- Error or blocked states.
- Responsive behavior.

For accessibility changes, a short note can be more useful than a polished image. Explain what you checked and how.

## SDK-First Architecture Rules

Fluent's SDK is the core product surface. The Electron UI should render SDK state and send user decisions back to the SDK.

### Keep These Boundaries Clear

- Input capture accepts user intent from text now and other modes later.
- Agent core interprets intent, plans, requests clarification, and reports results.
- Safety policy decides when actions require confirmation or must be blocked.
- Automation bridge executes approved platform actions and returns observable results.
- Provider layer connects to user-supplied AI providers without leaking secrets.
- UI renders state and decisions without owning core agent behavior.

### Do Not Put Core Logic Only In React

React components may present a command, plan, confirmation, or result. They should not become the only place where planning, safety policy, provider access, or automation execution is defined.

If you need app behavior that feels like product logic, ask whether it belongs in:

- SDK interface.
- Agent core.
- Safety layer.
- Provider layer.
- Automation bridge.
- UI rendering layer.

### New Input Modes Must Not Rewrite The Agent Core

Text is the only current input mode, but the architecture should allow future voice, switch, camera, gesture, eye tracking, and other assistive inputs.

When adding input-related code:

- Normalize user intent before it reaches planning logic.
- Do not assume all users type quickly or precisely.
- Do not make text input the only possible shape of intent forever.
- Preserve observable state so alternate input modes can confirm, pause, or stop actions.

### Automation Must Be Observable

Automation should not be a hidden side effect. Before and after meaningful actions, the system should be able to explain:

- What action is proposed.
- Why it is needed.
- Which app or OS surface it targets.
- What risk level it has.
- Whether user confirmation is required.
- What happened after execution.
- Whether the agent is blocked and what can recover it.

## Accessibility Requirements

Accessibility is not polish in Fluent. It is one of the reasons the product exists.

Fluent uses WCAG 2.2, WAI accessibility principles, ARIA Authoring Practices, and cognitive accessibility guidance as reference material. WCAG conformance alone is not enough for Fluent because the product is an assistive desktop control agent. Contributors should also test whether workflows are understandable, predictable, forgiving, and usable with low precision input.

### Baseline Principles

Use the POUR model from WCAG as a baseline:

- Perceivable: users can perceive information and state.
- Operable: users can operate controls through the input methods available to them.
- Understandable: users can understand the interface, language, errors, and next steps.
- Robust: the interface exposes correct semantics and works with assistive technologies.

### Fluent-Specific Accessibility Rules

For user-facing changes:

- All core controls must be reachable by keyboard.
- Focus states must be visible and not obscured.
- Pointer targets should be large and forgiving. Do not rely on precise pointer movement.
- Do not require drag gestures for core workflows. Provide button, keyboard, or stepper alternatives.
- Text must remain readable with zoom, larger text settings, and narrow windows.
- Important state must not depend on color alone.
- Animations should be limited, purposeful, and respect reduced motion preferences.
- Avoid time-limited prompts. If timing is necessary, make it extendable or disableable.
- Confirmation prompts must be clear about what will happen.
- Error messages must identify the problem and provide a recovery path.
- Loading states should name the action in progress when the action matters.
- Stop and pause controls must remain easy to find during automation.

### Keyboard Review

For every user-facing PR, ask:

- Can the workflow be completed without a mouse?
- Is tab order predictable?
- Is the focused element visually obvious?
- Does focus move to newly opened dialogs, confirmations, or blocking errors?
- Does focus return to a logical place after closing a modal or completing a step?
- Are keyboard shortcuts additive rather than required?
- Can the user stop or cancel automation from the keyboard?

### Screen Reader And Semantics Review

Use semantic HTML first. Add ARIA only when native semantics do not provide the needed meaning.

Check:

- Buttons are buttons, not clickable `div` elements.
- Inputs have labels.
- Icons that communicate meaning have accessible names.
- Decorative icons and images are hidden from assistive technology.
- Status changes are announced when they affect the current task.
- Dialogs expose a name, purpose, and contained focus behavior.
- Custom widgets follow WAI-ARIA Authoring Practices for roles, states, properties, and keyboard support.

### Cognitive Accessibility Review

Fluent should reduce cognitive load. This matters for elders, people in rehabilitation, people with cognitive or learning disabilities, people under stress, and people recovering from fatigue or injury.

Check:

- The screen has a clear purpose.
- The next action is obvious.
- Language is concrete and literal.
- Instructions are short and ordered.
- The user does not need to remember hidden state from earlier steps.
- Repeated workflows use consistent labels and placement.
- The app avoids unnecessary choices during high-stress moments.
- Recovery paths are visible when something fails.
- Users are not forced to re-enter information the app already has.

### Visual Accessibility Review

Fluent's visual direction is black text on `#ffe500` as the primary background, with direct and legible UI. When changing UI:

- Maintain strong contrast.
- Keep typography readable and avoid cramped layouts.
- Use visible focus indicators with enough contrast.
- Do not use color alone to indicate status.
- Do not hide important controls behind hover-only interactions.
- Avoid decorative motion or visual noise that competes with task state.

### Accessibility Test Notes For PRs

In your PR, include a short accessibility note. Examples:

```markdown
Keyboard: Completed the provider setup flow with Tab, Shift+Tab, Enter, and Escape.
Focus: Confirmation dialog receives focus on open and returns focus to the command input on close.
Motion: No new motion.
Screen reader: Buttons have accessible names; status update uses visible text.
```

If you cannot test a relevant assistive technology, say so. Do not invent test coverage.

## Safety And Privacy Requirements

Fluent may eventually handle AI provider keys, screenshots, app/window context, desktop automation permissions, and user task history. Treat these as sensitive.

### Secrets

- Do not log AI provider keys.
- Do not print environment variables that may contain secrets.
- Do not commit keys, tokens, `.env` files, screenshots with sensitive data, or local user data.
- Redact secrets in bug reports and screenshots.

### External Requests

Any code that sends data to an external service must make the boundary explicit:

- What data is sent.
- Which provider receives it.
- Why it is needed.
- Whether the user configured the provider.
- Whether screenshots, app names, window titles, document text, or clipboard data are included.

### Automation Risk

Automation can affect real desktop state. Prefer reversible or confirmable behavior.

High-impact actions should require confirmation, including:

- Sending messages or emails.
- Submitting forms.
- Making purchases.
- Deleting, moving, or overwriting user files.
- Changing system settings.
- Granting permissions.
- Running shell commands.
- Interacting with password managers, banking, healthcare, legal, or government services.

Low-risk actions may execute with less friction, but they should still be observable and stoppable.

### Screenshots And Desktop Context

Screenshots and app/window context may expose private information. If your contribution touches screenshot capture or desktop inspection:

- Document what is captured.
- Keep capture scoped to what is needed.
- Avoid storing screenshots unless necessary.
- Avoid sending screenshots to a provider unless the user-facing behavior makes that clear.
- Provide a route for the user to stop or deny capture.

### Security Reports

Do not open public issues for vulnerabilities. Follow [SECURITY.md](SECURITY.md).

## Documentation Contributions

Documentation is a first-class contribution. Good docs make the project safer and easier to contribute to.

### Documentation Standards

Write docs that are:

- Accurate to the current repo.
- Clear enough for a first-time contributor.
- Specific about commands, file paths, and expected outcomes.
- Honest about missing tooling or unfinished architecture.
- Written in plain language.
- Structured with headings and short sections.
- Free of unexplained jargon.

Avoid:

- Claiming features exist before they do.
- Duplicating long sections from other docs.
- Using marketing language in contributor docs.
- Adding stale instructions for scripts that do not exist.
- Hiding important warnings in footnotes.

### Documentation PR Checklist

Before opening a docs PR:

- Run `npm run build` if your docs change is paired with code or examples imported by code.
- Check links and paths.
- Confirm commands match `package.json`.
- Confirm architecture language matches [docs/architecture.md](docs/architecture.md).
- Confirm accessibility language matches [docs/accessibility-principles.md](docs/accessibility-principles.md).
- Keep examples copy-pasteable where possible.

### User-Facing Documentation

User-facing docs should be especially careful because Fluent serves people who may be using alternate input methods.

Use:

- Short sentences.
- Concrete verbs.
- Ordered steps.
- Clear recovery instructions.
- Plain descriptions of risk.

Avoid:

- Idioms that may not translate clearly.
- Humor in safety-critical instructions.
- Dense paragraphs around setup or errors.
- Instructions that require fast timing or precise pointer use.

## AI-Assisted Contributions

AI tools are allowed, but contributors are responsible for the final work.

If you use an AI coding assistant:

- Read the generated diff before opening a PR.
- Run the available checks yourself.
- Remove invented scripts, APIs, tests, or docs.
- Do not include secrets, private user data, or confidential screenshots in prompts.
- Mention AI assistance in the PR when it materially shaped the code or docs.
- Be ready to explain the implementation.

AI-generated work must meet the same accessibility, safety, privacy, and review standards as any other contribution.

## Review Process

All code and docs changes should go through pull requests.

Reviewers will look for:

- Clear problem and scope.
- Fit with the SDK-first architecture.
- Accessibility impact.
- Safety and privacy impact.
- Correctness and maintainability.
- Local checks and manual verification.
- Clear documentation for new behavior.

During review:

- Respond to requested changes directly.
- Ask clarifying questions when needed.
- Push follow-up commits to the same branch.
- Do not force-push during active review unless it materially helps readability.
- Keep unrelated cleanup out of the PR.

Maintainers may ask you to split a PR. This is normal for early architecture work.

## Maintainer Notes

These are expectations for maintainers and frequent contributors.

- Keep issue labels meaningful for new contributors.
- Mark reserved or design-heavy work clearly.
- Prefer small reviewable PRs even for maintainer changes.
- Keep `CONTRIBUTING.md` accurate when scripts, package managers, test runners, or architecture boundaries change.
- Do not merge user-facing changes without accessibility review notes.
- Do not merge provider, screenshot, or automation changes without safety and privacy review notes.
- When rejecting an idea, explain the product or architecture reason.

## Reference Material

This guide uses the following references for structure and accessibility expectations:

- [Gemini CLI CONTRIBUTING.md](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md) for a strong example of a contribution guide structure with setup, workflow, and documentation sections.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) for the POUR accessibility model, success criteria, and the expectation that accessibility is tested with both automation and human evaluation.
- [WAI Accessibility Principles](https://www.w3.org/WAI/fundamentals/accessibility-principles/) for practical guidance on perceivable, operable, understandable, and robust experiences.
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) for accessible semantics and keyboard behavior in custom widgets.
- [WAI Easy Checks](https://www.w3.org/WAI/test-evaluate/preliminary/) for first-pass accessibility review techniques.
- [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/) for guidance on clear purpose, understandable language, memory support, and inclusive user testing.

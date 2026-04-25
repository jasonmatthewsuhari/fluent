# Fluent

**An open-source desktop AI agent for accessible computer control.**

Fluent is an Electron app for people who need alternatives to traditional mouse and keyboard control, including disabled users, elders, and people in rehabilitation. The goal is simple: let someone describe what they want to do on their computer, then have Fluent help carry out that task in a visible, controllable, and trustworthy way.

Fluent is early and experimental. The first version focuses on a text-driven agent loop so we can validate the agent, automation model, and safety UX before adding more input modes.

## Why Fluent

Most desktop software still assumes precise mouse movement, fast typing, and a fairly high tolerance for complex interfaces. That excludes many people.

Fluent explores a different model:

- The user states an intent in plain language.
- Fluent interprets the task.
- Fluent chooses the safest available automation path.
- Fluent shows meaningful plans and progress.
- The user can confirm, pause, or stop actions.

Long term, Fluent should support text, voice, switch access, camera or gesture input, eye tracking, and other assistive inputs. The agent core should not depend on a single mode of input.

## Current Scope

The first pass uses text input only.

This keeps the project focused on proving the core loop:

- Can the agent understand practical desktop tasks from natural language?
- When are structured OS automation tools enough?
- When is screenshot or vision-language-model reasoning needed?
- What should the app show before, during, and after automation?
- Which actions should require confirmation?

## Principles

- **Accessibility first:** large targets, clear state, keyboard reachability, readable type, reduced cognitive load.
- **Local control:** users bring their own AI provider keys and stay in control of what Fluent can access.
- **Visible automation:** important agent decisions and desktop actions should be observable.
- **Safety by default:** risky or irreversible actions should be confirmable.
- **Stop is always available:** the user should never feel trapped inside an automation flow.
- **Open core:** the primary computer-control experience should be useful as free and open-source software.

## Planned Architecture

Fluent is designed around a few clear boundaries:

- **Electron app shell:** desktop window, native integration, app lifecycle.
- **Accessible UI:** command input, conversation, action timeline, confirmations, settings.
- **Agent core:** interprets user intent, plans actions, requests clarification, reports results.
- **Automation bridge:** interacts with operating system automation APIs, app inspection, keyboard and mouse simulation, and screenshots where needed.
- **Provider layer:** connects to AI providers using user-supplied credentials.
- **Safety layer:** permission checks, confirmation policy, stop/pause handling, and action logging.

See [docs/architecture.md](docs/architecture.md) for the working architecture direction.

## Documentation

- [Vision](docs/vision.md)
- [Accessibility principles](docs/accessibility-principles.md)
- [Architecture](docs/architecture.md)
- [Frontend plan](docs/frontend-plan.md)
- [Development](docs/development.md)
- [DevOps](docs/devops.md)
- [Release process](docs/release.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Support](SUPPORT.md)

## Status

Fluent is in pre-alpha. It is not ready for daily assistive use yet, and it should not be treated as medical, emergency, or safety-critical infrastructure.

The current repo is being prepared for the first implementation pass.

## Contributing

Fluent needs contributors who care about accessible software and reliable desktop automation.

Useful areas include:

- Electron and desktop app engineering
- Accessibility design and testing
- OS automation on Windows, macOS, and Linux
- AI agent planning and tool use
- Security and privacy review
- Usability feedback from people who use assistive technology

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Apache-2.0. See [LICENSE](LICENSE).

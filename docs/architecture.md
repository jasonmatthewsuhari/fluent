# Architecture

Fluent is planned as an Electron desktop app with a visible agent loop and a platform automation bridge.

## Core Modules

- **App shell:** Electron lifecycle, windows, native menus, packaging, updates.
- **Accessible UI:** command input, conversation history, action timeline, confirmation prompts, settings.
- **Agent core:** intent interpretation, planning, clarification, tool selection, result reporting.
- **Automation bridge:** OS automation APIs, app and window inspection, keyboard and mouse simulation, screenshots when needed.
- **AI provider layer:** user-supplied provider credentials, model selection, connection checks, request boundaries.
- **Safety layer:** permission checks, confirmation policy, stop and pause handling, audit-style action logs.

## First-Pass Flow

1. User enters a text command.
2. The UI sends the command to the agent core.
3. The agent decides whether it needs context from the automation bridge.
4. The agent proposes or performs low-risk actions.
5. The safety layer requires confirmation for meaningful risk.
6. The automation bridge executes approved actions.
7. The UI reports progress, result, and next steps.

## Design Constraints

- New input modes should plug into the agent core without rewriting automation.
- Provider code should be isolated from UI components.
- Automation tools should return observable results.
- Secrets should not be logged.
- Screenshots and desktop context should have explicit handling.
- Safety controls should not depend on a single UI surface.

## Early Open Questions

- Which operating system is the first implementation target?
- Which AI providers are supported first?
- Which actions require confirmation by default?
- How much app and window context can be gathered reliably without vision?
- What should the audit log expose to users?

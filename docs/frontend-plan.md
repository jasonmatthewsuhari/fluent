# Fluent Frontend Plan

## Product Shape

Fluent should open directly into the usable agent workspace. The first screen is not a landing page.

The core experience is a desktop command center where the user can type what they want, review what the agent plans to do, and follow progress as Fluent controls the computer.

## Visual System

- Primary background: `#ffe500`.
- Primary text: `#000000`.
- Secondary surfaces: white or near-white panels for dense content when needed.
- Accent states: use restrained functional colors for success, warning, danger, and active focus states.
- Typography: large, plain, highly legible UI text with no negative letter spacing.
- Shape language: simple rectangles with modest radii, no decorative card-heavy marketing layout.

The yellow background should identify the product immediately, while the working UI should stay calm enough for repeated use.

## First-Pass Layout

The first-pass app should have three main zones:

- Command input: a persistent text box for user intent, with a clear send control and optional examples.
- Agent activity: the current task, planned next action, progress log, and any confirmation prompts.
- System context: connected AI provider, automation permissions, active app/window, and safety status.

Recommended desktop layout:

- Left sidebar for mode, provider, and permissions status.
- Main center panel for the conversation and agent action stream.
- Right inspector for current plan, active target app, and recent automation events.
- Bottom command bar for text input that is always reachable.

On narrow windows, collapse the inspector into tabs and keep the command input fixed at the bottom.

## Primary Screens

### Agent Workspace

The default screen for sending commands and monitoring execution.

Key elements:

- Text command input.
- Conversation history.
- Action timeline.
- Confirmation prompts.
- Stop or pause control.
- Current app/window target.

### API Key Setup

Allows free users to bring their own AI keys.

Key elements:

- Provider selector.
- Secure key entry.
- Model selection.
- Connection test.
- Clear privacy note explaining that keys stay local unless the implementation says otherwise.

### Automation Permissions

Guides the user through OS permissions required for desktop control.

Key elements:

- Permission checklist.
- Current permission status.
- Retry checks.
- Platform-specific next steps.

### Settings

Basic configuration for accessibility, AI, and automation.

Key elements:

- Text size and density controls.
- Reduced motion toggle.
- Confirmation strictness.
- AI provider settings.
- Automation safety preferences.

## Agent Interaction Model

The frontend should make the agent loop visible:

1. User enters a command.
2. Fluent interprets intent.
3. Fluent shows the planned action when the task has meaningful risk.
4. User confirms if required.
5. Fluent performs the action.
6. Fluent reports the result and asks for clarification if blocked.

For low-risk tasks, the app can execute immediately, but the user must always have an obvious stop control.

## Accessibility Requirements

- All controls must be reachable by keyboard.
- Hit targets should be large enough for reduced precision input.
- Text should remain readable at larger font sizes.
- Focus states must be obvious.
- Important state changes should not rely on color alone.
- Avoid time-limited interactions unless they can be extended or disabled.
- Do not require drag gestures for core workflows.

## Component Inventory

- App shell.
- Sidebar navigation.
- Provider status badge.
- Permission status checklist.
- Conversation message.
- Agent action item.
- Confirmation prompt.
- Command input bar.
- Stop or pause button.
- Settings form controls.
- Toast or inline status messaging.

## Initial Implementation Milestones

1. Create the Electron shell and frontend routing.
2. Build the static agent workspace UI using the Fluent visual system.
3. Add API key setup flow with local persistence placeholder.
4. Add automation permission status UI with mocked platform checks.
5. Wire a local text command loop to a mock agent response.
6. Replace mocks with real agent and automation bridges.

## Open Product Questions

- Which AI providers are supported first?
- Which operating system is the first target?
- What actions require confirmation by default?
- What data, if any, is sent to external AI providers?
- Which automation actions should be blocked until explicit user confirmation?

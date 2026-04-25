# Fluent Agent Notes

## Product

Fluent is an Electron desktop AI agent for people who need alternate ways to use a computer, including disabled users, elders, and people in rehabilitation.

The long-term goal is multimodal computer control. Fluent should accept different forms of user intent, reason about what the user wants, and operate desktop applications on their behalf where appropriate.

## First Pass

The first validation pass uses text input only. This keeps the product focused on proving the agent loop before adding more input modes.

The initial app should validate:

- Whether the agent can understand practical desktop tasks from natural language.
- Whether OS automation tools are sufficient for many workflows without always requiring a vision-language model.
- Where direct automation breaks down and a VLM or screenshot-based reasoning becomes necessary.
- Whether the interaction model is understandable and trustworthy for users who may not use traditional mouse and keyboard control comfortably.

## Control Modes

Fluent should eventually support many modes of control, including text, voice, camera or gesture input, switch access, eye tracking, and other assistive inputs.

For now, only text is in scope. Design the architecture so new input modes can be added without rewriting the agent core.

## Automation Strategy

Prefer OS automation tools when they can complete a task reliably. A VLM is often the most accurate way to understand screen state, but it is not always necessary and may be slower or more expensive.

The agent should be able to combine:

- Structured OS automation APIs.
- App and window inspection where available.
- Keyboard and mouse simulation.
- Screenshots or VLM reasoning when automation context is insufficient.

## AI Access Model

Fluent is free and open source. Users should be able to bring their own AI API keys.

## Design Direction

Use black as the primary text color and `#ffe500` as the primary background color.

The interface should feel direct, legible, and confidence-building. Because the audience includes disabled users, elders, and people in rehab, prioritize clarity, large hit targets, visible state, accessible contrast, predictable navigation, and low cognitive load.

## Engineering Principles

- Keep the first version narrowly focused on the text-driven agent loop.
- Separate input capture, agent reasoning, OS automation, and UI state.
- Make automation actions observable before and after execution.
- Prefer reversible or confirmable actions for high-impact tasks.
- Avoid hiding important agent behavior behind vague loading states.
- Treat accessibility as a primary requirement, not a later polish pass.

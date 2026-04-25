# Accessibility Principles

Fluent is an accessibility-first app. Interface and automation decisions should be judged by whether they improve control, comprehension, and trust for users with different motor, visual, cognitive, and endurance needs.

## Interface Requirements

- All core controls must be reachable by keyboard.
- Hit targets should be large enough for reduced precision input.
- Focus states must be obvious.
- Text should remain readable at larger sizes.
- Important state changes must not rely on color alone.
- Core workflows should not require drag gestures.
- Time-limited prompts should be avoidable or extendable.
- Motion should be restrained and respect reduced-motion settings.

## Agent UX Requirements

- Show what Fluent is doing in plain language.
- Ask for confirmation before high-impact or irreversible actions.
- Keep stop and pause controls visible.
- Preserve enough history for users to understand what happened.
- Make blocked states explicit and recoverable.
- Avoid vague loading states when a meaningful action is happening.

## Review Checklist

Use this checklist for user-facing changes:

- Can the workflow be completed without a mouse?
- Is the current state visible?
- Is the next action clear?
- Can the user safely stop the agent?
- Does the UI still work with larger text?
- Is error text specific enough to guide recovery?

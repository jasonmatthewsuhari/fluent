# Fluent SDK

`@fluent-ai/sdk` is the core Fluent SDK for accessible computer-use agents.

It has two namespaces:

- `Fluent.input` turns user input into natural-language intent. V1 implements text input.
- `Fluent.computerUse` runs computer-use tasks through planning, safety checks, event streams, and OS-specific automation adapters.

## Install

```bash
npm install @fluent-ai/sdk
```

Real desktop automation is optional and requires the peer dependency:

```bash
npm install @nut-tree-fork/nut-js
```

## Quick Start

```ts
import { Fluent, MockAIProvider, createMockAutomationAdapter } from "@fluent-ai/sdk";

const provider = new MockAIProvider();
const registry = Fluent.computerUse.automation.createCapabilityRegistry();
registry.register(createMockAutomationAdapter("windows"));

const agent = Fluent.computerUse.createAgent({ provider, registry });
const intent = Fluent.input.fromText("Open Notepad and type a grocery list");
const task = agent.startTask({ input: intent });

for await (const event of task.events) {
  console.log(event.type, event);

  if (event.type === "confirmation.required") {
    task.confirmAction(event.action.id);
  }
}
```

## V1 Scope

- Text input translation.
- Mock AI provider.
- Event-stream computer-use task runtime.
- Confirmation-gated automation.
- Capability registry with Windows, macOS, and Linux adapter factories.
- Optional real basic actions through `@nut-tree-fork/nut-js`.

The SDK does not include real hosted AI provider integrations yet.

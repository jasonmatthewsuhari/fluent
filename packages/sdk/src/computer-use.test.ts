import { describe, expect, it } from "vitest";
import { createMockAutomationAdapter } from "./automation/index.js";
import { createAgent } from "./computer-use.js";
import { input } from "./input.js";
import { MockAIProvider } from "./provider.js";

describe("computer use agent", () => {
  it("streams a read-only task to completion", async () => {
    const agent = createAgent({
      provider: new MockAIProvider(),
      adapters: [createMockAutomationAdapter("windows")]
    });
    const task = agent.startTask({
      input: input.fromText("Take a screenshot"),
      context: { platform: "windows" }
    });
    const events = await collectEvents(task.events);

    expect(events.map((event) => event.type)).toEqual([
      "task.started",
      "plan.created",
      "action.proposed",
      "action.started",
      "action.completed",
      "task.completed"
    ]);
  });

  it("requires confirmation before input automation runs", async () => {
    const agent = createAgent({
      provider: new MockAIProvider(),
      adapters: [createMockAutomationAdapter("windows")]
    });
    const task = agent.startTask({
      input: input.fromText("Type hello"),
      context: { platform: "windows" }
    });
    const seen: string[] = [];

    for await (const event of task.events) {
      seen.push(event.type);

      if (event.type === "confirmation.required") {
        task.confirmAction(event.action.id);
      }
    }

    expect(seen).toContain("confirmation.required");
    expect(seen).toContain("action.completed");
    expect(seen.at(-1)).toBe("task.completed");
  });

  it("requires confirmation before clipboard writes", async () => {
    const agent = createAgent({
      provider: new MockAIProvider(),
      adapters: [createMockAutomationAdapter("windows")]
    });
    const task = agent.startTask({
      input: input.fromText("Write hello to clipboard"),
      context: { platform: "windows" }
    });
    const seen: string[] = [];

    for await (const event of task.events) {
      seen.push(event.type);

      if (event.type === "confirmation.required") {
        expect(event.action.capability).toBe("clipboard.writeText");
        task.confirmAction(event.action.id);
      }
    }

    expect(seen).toContain("confirmation.required");
    expect(seen.at(-1)).toBe("task.completed");
  });

  it("allows clipboard reads without confirmation", async () => {
    const agent = createAgent({
      provider: new MockAIProvider(),
      adapters: [createMockAutomationAdapter("windows")]
    });
    const task = agent.startTask({
      input: input.fromText("Read clipboard"),
      context: { platform: "windows" }
    });
    const events = await collectEvents(task.events);

    expect(events.map((event) => event.type)).not.toContain("confirmation.required");
    expect(events.at(-1)?.type).toBe("task.completed");
  });

  it("blocks when a confirmation is rejected", async () => {
    const agent = createAgent({
      provider: new MockAIProvider(),
      adapters: [createMockAutomationAdapter("windows")]
    });
    const task = agent.startTask({
      input: input.fromText("Open Notepad"),
      context: { platform: "windows" }
    });
    const seen: string[] = [];

    for await (const event of task.events) {
      seen.push(event.type);

      if (event.type === "confirmation.required") {
        task.rejectAction(event.action.id);
      }
    }

    expect(seen).toContain("confirmation.required");
    expect(seen.at(-1)).toBe("task.blocked");
  });
});

async function collectEvents<T>(events: AsyncIterable<T>): Promise<T[]> {
  const collected: T[] = [];

  for await (const event of events) {
    collected.push(event);
  }

  return collected;
}

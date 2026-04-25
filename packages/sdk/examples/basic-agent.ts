import {
  Fluent,
  MockAIProvider,
  createMockAutomationAdapter
} from "@fluent-ai/sdk";

const provider = new MockAIProvider();
const registry = Fluent.computerUse.automation.createCapabilityRegistry();

registry.register(createMockAutomationAdapter("windows"));

const agent = Fluent.computerUse.createAgent({ provider, registry });
const input = Fluent.input.fromText("Open Notepad and type a grocery list");
const task = agent.startTask({ input });

for await (const event of task.events) {
  console.log(event.type, event);

  if (event.type === "confirmation.required") {
    task.confirmAction(event.action.id);
  }
}

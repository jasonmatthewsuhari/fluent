import {
  Fluent,
  MockAIProvider,
  createCurrentPlatformAutomationAdapter
} from "../index.js";

if (process.env.FLUENT_REAL_AUTOMATION !== "1") {
  console.error("Refusing to run real automation without FLUENT_REAL_AUTOMATION=1.");
  process.exit(1);
}

const registry = Fluent.computerUse.automation.createCapabilityRegistry();
registry.register(createCurrentPlatformAutomationAdapter());

const readiness = await registry.getReadiness("windows");
console.log(JSON.stringify({ readiness }, null, 2));

const agent = Fluent.computerUse.createAgent({
  provider: new MockAIProvider(),
  registry
});

const task = agent.startTask({
  input: Fluent.input.fromText("Open notepad and type Fluent smoke test"),
  context: {
    platform: "windows"
  }
});

for await (const event of task.events) {
  console.log(event.type, JSON.stringify(event));

  if (event.type === "confirmation.required") {
    task.confirmAction(event.action.id);
  }
}

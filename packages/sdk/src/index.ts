import * as automation from "./automation/index.js";
import { createAgent } from "./computer-use.js";
import { input } from "./input.js";

export { createAgent, input };
export { MockAIProvider } from "./provider.js";
export { DefaultSafetyPolicy } from "./safety.js";
export {
  createMockAutomationAdapter,
  createCurrentPlatformAutomationAdapter,
  createLinuxAutomationAdapter,
  createMacOSAutomationAdapter,
  createWindowsAutomationAdapter
} from "./automation/index.js";

export type {
  AIProvider,
  PlanRequest
} from "./provider.js";
export type {
  SafetyDecision,
  SafetyPolicy
} from "./safety.js";
export type {
  ComputerUseAgent,
  ComputerUseAgentOptions,
  ComputerUseTask
} from "./computer-use.js";
export type {
  AutomationAdapter,
  AutomationCapability,
  AutomationCapabilityName,
  CapabilityRegistry
} from "./automation/index.js";
export type {
  AgentContext,
  AgentPlan,
  AutomationAction,
  AutomationResult,
  ComputerUseEvent,
  FluentPlatform,
  NaturalLanguageIntent,
  StartTaskOptions
} from "./types.js";

export const Fluent = {
  input,
  computerUse: {
    createAgent,
    automation
  }
};

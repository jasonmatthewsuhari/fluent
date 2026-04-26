export { baseCapabilities } from "./capabilities.js";
export { createCapabilityRegistry } from "./registry.js";
export { createMockAutomationAdapter } from "./mock.js";
export {
  createCurrentPlatformAutomationAdapter,
  createLinuxAutomationAdapter,
  createMacOSAutomationAdapter,
  createWindowsAutomationAdapter,
  detectPlatform
} from "./os.js";
export { createNutAutomationAdapter } from "./nut-js.js";
export type {
  AutomationAdapter,
  AutomationCapability,
  AutomationCapabilityName,
  AutomationReadiness,
  AutomationReadinessCheck,
  CapabilityRegistry
} from "./types.js";

import {
  AutomationAction,
  AutomationResult,
  FluentPlatform
} from "../types.js";
import { baseCapabilities } from "./capabilities.js";
import { AutomationAdapter } from "./types.js";

export function createMockAutomationAdapter(platform: FluentPlatform): AutomationAdapter {
  return {
    id: `mock-${platform}`,
    platform,

    getCapabilities() {
      return baseCapabilities(platform);
    },

    getReadiness() {
      return {
        platform,
        ok: true,
        checks: [
          {
            name: "mock",
            status: "ready",
            message: "Mock automation adapter is ready."
          }
        ]
      };
    },

    async execute(action: AutomationAction): Promise<AutomationResult> {
      return {
        actionId: action.id,
        capability: action.capability,
        ok: true,
        status: "success",
        output: {
          mocked: true,
          platform,
          action
        }
      };
    }
  };
}

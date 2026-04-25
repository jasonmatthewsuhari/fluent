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

    async execute(action: AutomationAction): Promise<AutomationResult> {
      return {
        actionId: action.id,
        capability: action.capability,
        ok: true,
        output: {
          mocked: true,
          platform,
          action
        }
      };
    }
  };
}

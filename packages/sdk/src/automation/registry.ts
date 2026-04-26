import {
  AutomationAction,
  AutomationResult,
  FluentPlatform
} from "../types.js";
import {
  AutomationAdapter,
  AutomationCapability,
  CapabilityRegistry
} from "./types.js";

export function createCapabilityRegistry(
  adapters: AutomationAdapter[] = []
): CapabilityRegistry {
  const registered = [...adapters];

  return {
    register(adapter) {
      registered.push(adapter);
    },

    getAdapters(platform?: FluentPlatform) {
      if (!platform) {
        return [...registered];
      }

      return registered.filter((adapter) => adapter.platform === platform);
    },

    async getCapabilities(platform?: FluentPlatform) {
      const capabilities: AutomationCapability[] = [];

      for (const adapter of this.getAdapters(platform)) {
        capabilities.push(...(await adapter.getCapabilities()));
      }

      return capabilities;
    },

    async getReadiness(platform?: FluentPlatform) {
      const readiness = [];

      for (const adapter of this.getAdapters(platform)) {
        if (adapter.getReadiness) {
          readiness.push(await adapter.getReadiness());
        } else {
          readiness.push({
            platform: adapter.platform,
            ok: true,
            checks: [
              {
                name: "adapter",
                status: "unknown" as const,
                message: "Adapter does not expose readiness checks."
              }
            ]
          });
        }
      }

      return readiness;
    },

    async execute(action: AutomationAction, platform?: FluentPlatform): Promise<AutomationResult> {
      const adapters = this.getAdapters(platform);

      for (const adapter of adapters) {
        const capabilities = await adapter.getCapabilities();
        const match = capabilities.find(
          (capability) => capability.name === action.capability && capability.available
        );

        if (match) {
          return adapter.execute(action);
        }
      }

      return {
        actionId: action.id,
        capability: action.capability,
        ok: false,
        status: "unsupported",
        error: `No available automation capability found for ${action.capability}.`
      };
    }
  };
}

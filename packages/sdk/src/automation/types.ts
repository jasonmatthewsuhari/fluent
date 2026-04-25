import {
  AutomationAction,
  AutomationResult,
  FluentPlatform
} from "../types.js";

export type AutomationCapabilityName = AutomationAction["capability"];

export type AutomationCapability = {
  name: AutomationCapabilityName;
  platform: FluentPlatform;
  description: string;
  risk: "read" | "input" | "state_change" | "sensitive";
  available: boolean;
  requiresConfirmation: boolean;
};

export interface AutomationAdapter {
  readonly id: string;
  readonly platform: FluentPlatform;
  getCapabilities(): Promise<AutomationCapability[]> | AutomationCapability[];
  execute(action: AutomationAction): Promise<AutomationResult>;
}

export type CapabilityRegistry = {
  register(adapter: AutomationAdapter): void;
  getAdapters(platform?: FluentPlatform): AutomationAdapter[];
  getCapabilities(platform?: FluentPlatform): Promise<AutomationCapability[]>;
  execute(action: AutomationAction, platform?: FluentPlatform): Promise<AutomationResult>;
};

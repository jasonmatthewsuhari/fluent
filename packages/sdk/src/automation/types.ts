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

export type AutomationReadinessCheck = {
  name: string;
  status: "ready" | "missing_permission" | "missing_dependency" | "unsupported" | "unknown";
  message: string;
};

export type AutomationReadiness = {
  platform: FluentPlatform;
  ok: boolean;
  checks: AutomationReadinessCheck[];
};

export interface AutomationAdapter {
  readonly id: string;
  readonly platform: FluentPlatform;
  getCapabilities(): Promise<AutomationCapability[]> | AutomationCapability[];
  getReadiness?(): Promise<AutomationReadiness> | AutomationReadiness;
  execute(action: AutomationAction): Promise<AutomationResult>;
}

export type CapabilityRegistry = {
  register(adapter: AutomationAdapter): void;
  getAdapters(platform?: FluentPlatform): AutomationAdapter[];
  getCapabilities(platform?: FluentPlatform): Promise<AutomationCapability[]>;
  getReadiness(platform?: FluentPlatform): Promise<AutomationReadiness[]>;
  execute(action: AutomationAction, platform?: FluentPlatform): Promise<AutomationResult>;
};

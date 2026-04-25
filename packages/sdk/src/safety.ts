import { AutomationAction } from "./types.js";

export type SafetyDecision =
  | {
      status: "allow";
      reason: string;
    }
  | {
      status: "confirm";
      reason: string;
    };

export interface SafetyPolicy {
  evaluate(action: AutomationAction): SafetyDecision;
}

export class DefaultSafetyPolicy implements SafetyPolicy {
  evaluate(action: AutomationAction): SafetyDecision {
    if (action.risk === "read") {
      return {
        status: "allow",
        reason: "Read-only action."
      };
    }

    return {
      status: "confirm",
      reason: `Action ${action.capability} can affect the user's desktop and requires confirmation.`
    };
  }
}

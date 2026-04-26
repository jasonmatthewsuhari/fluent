export type FluentPlatform = "windows" | "macos" | "linux";

export type FluentId = string;

export type NaturalLanguageIntent = {
  id: FluentId;
  modality: "text";
  text: string;
  normalizedText: string;
  createdAt: string;
  confidence: number;
  metadata: Record<string, unknown>;
};

export type AgentContext = {
  platform?: FluentPlatform;
  activeApp?: string;
  activeWindowTitle?: string;
  metadata?: Record<string, unknown>;
};

export type AutomationRisk = "read" | "input" | "state_change" | "sensitive";

export type AutomationFailureStatus =
  | "unsupported"
  | "permission_denied"
  | "failed";

export type AutomationAction =
  | {
      id: FluentId;
      capability: "keyboard.typeText";
      risk: AutomationRisk;
      text: string;
    }
  | {
      id: FluentId;
      capability: "keyboard.pressKey";
      risk: AutomationRisk;
      key: string;
    }
  | {
      id: FluentId;
      capability: "keyboard.pressShortcut";
      risk: AutomationRisk;
      keys: string[];
    }
  | {
      id: FluentId;
      capability: "mouse.move";
      risk: AutomationRisk;
      x: number;
      y: number;
    }
  | {
      id: FluentId;
      capability: "mouse.click";
      risk: AutomationRisk;
      button?: "left" | "right" | "middle";
    }
  | {
      id: FluentId;
      capability: "mouse.doubleClick";
      risk: AutomationRisk;
      button?: "left" | "right" | "middle";
    }
  | {
      id: FluentId;
      capability: "screen.screenshot";
      risk: AutomationRisk;
    }
  | {
      id: FluentId;
      capability: "window.getActive";
      risk: AutomationRisk;
    }
  | {
      id: FluentId;
      capability: "app.open";
      risk: AutomationRisk;
      appName: string;
    }
  | {
      id: FluentId;
      capability: "clipboard.readText";
      risk: AutomationRisk;
    }
  | {
      id: FluentId;
      capability: "clipboard.writeText";
      risk: AutomationRisk;
      text: string;
    }
  | {
      id: FluentId;
      capability: "filesystem.revealPath";
      risk: AutomationRisk;
      path: string;
    };

export type AgentPlan = {
  id: FluentId;
  summary: string;
  actions: AutomationAction[];
};

export type AutomationResult = {
  actionId: FluentId;
  capability: AutomationAction["capability"];
  ok: boolean;
  status: "success" | AutomationFailureStatus;
  output?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
};

export type ComputerUseEvent =
  | {
      type: "task.started";
      taskId: FluentId;
      input: NaturalLanguageIntent;
    }
  | {
      type: "plan.created";
      taskId: FluentId;
      plan: AgentPlan;
    }
  | {
      type: "action.proposed";
      taskId: FluentId;
      action: AutomationAction;
    }
  | {
      type: "confirmation.required";
      taskId: FluentId;
      action: AutomationAction;
      reason: string;
    }
  | {
      type: "action.started";
      taskId: FluentId;
      action: AutomationAction;
    }
  | {
      type: "action.completed";
      taskId: FluentId;
      action: AutomationAction;
      result: AutomationResult;
    }
  | {
      type: "task.blocked";
      taskId: FluentId;
      reason: string;
      action?: AutomationAction;
    }
  | {
      type: "task.completed";
      taskId: FluentId;
      result: {
        planId: FluentId;
        completedActions: number;
      };
    }
  | {
      type: "task.failed";
      taskId: FluentId;
      error: string;
    };

export type StartTaskOptions = {
  input: NaturalLanguageIntent;
  context?: AgentContext;
};

export type ConfirmationDecision = "approved" | "rejected" | "pending";

import { createId } from "./ids.js";
import {
  AgentContext,
  AgentPlan,
  AutomationAction,
  NaturalLanguageIntent
} from "./types.js";

export type PlanRequest = {
  input: NaturalLanguageIntent;
  context?: AgentContext;
};

export interface AIProvider {
  readonly name: string;
  createPlan(request: PlanRequest): Promise<AgentPlan>;
}

export class MockAIProvider implements AIProvider {
  readonly name = "mock";

  async createPlan(request: PlanRequest): Promise<AgentPlan> {
    const text = request.input.normalizedText.toLowerCase();
    const actions: AutomationAction[] = [];
    let handledClipboard = false;

    if (text.includes("screenshot") || text.includes("screen")) {
      actions.push({
        id: createId("action"),
        capability: "screen.screenshot",
        risk: "read"
      });
    }

    if (text.includes("clipboard")) {
      handledClipboard = true;

      if (text.includes("read")) {
        actions.push({
          id: createId("action"),
          capability: "clipboard.readText",
          risk: "read"
        });
      } else {
        actions.push({
          id: createId("action"),
          capability: "clipboard.writeText",
          risk: "state_change",
          text: inferTypedText(request.input.normalizedText)
        });
      }
    }

    if (text.includes("reveal") || text.includes("show in folder")) {
      actions.push({
        id: createId("action"),
        capability: "filesystem.revealPath",
        risk: "state_change",
        path: inferPath(request.input.normalizedText)
      });
    }

    if (text.includes("open")) {
      actions.push({
        id: createId("action"),
        capability: "app.open",
        risk: "state_change",
        appName: inferAppName(text)
      });
    }

    if (text.includes("press")) {
      actions.push({
        id: createId("action"),
        capability: "keyboard.pressKey",
        risk: "input",
        key: inferKey(text)
      });
    }

    if (!handledClipboard && (text.includes("type") || text.includes("write"))) {
      actions.push({
        id: createId("action"),
        capability: "keyboard.typeText",
        risk: "input",
        text: inferTypedText(request.input.normalizedText)
      });
    }

    if (actions.length === 0) {
      actions.push({
        id: createId("action"),
        capability: "window.getActive",
        risk: "read"
      });
    }

    return {
      id: createId("plan"),
      summary: `Mock plan for: ${request.input.normalizedText}`,
      actions
    };
  }
}

function inferAppName(text: string): string {
  if (text.includes("notepad")) {
    return "notepad";
  }

  if (text.includes("browser")) {
    return "browser";
  }

  return "application";
}

function inferTypedText(text: string): string {
  const quoted = text.match(/["'](.+)["']/);

  if (quoted?.[1]) {
    return quoted[1];
  }

  return text;
}

function inferKey(text: string): string {
  if (text.includes("enter")) {
    return "Enter";
  }

  if (text.includes("escape") || text.includes("esc")) {
    return "Escape";
  }

  return "Space";
}

function inferPath(text: string): string {
  const quoted = text.match(/["'](.+)["']/);

  if (quoted?.[1]) {
    return quoted[1];
  }

  return ".";
}

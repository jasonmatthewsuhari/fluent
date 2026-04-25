import { AutomationAction, AutomationResult, FluentPlatform } from "../types.js";
import { baseCapabilities } from "./capabilities.js";
import { AutomationAdapter } from "./types.js";

type NutModule = {
  keyboard: {
    type: (...text: string[]) => Promise<void>;
    pressKey: (...keys: unknown[]) => Promise<void>;
    releaseKey: (...keys: unknown[]) => Promise<void>;
  };
  mouse: {
    setPosition: (point: unknown) => Promise<void>;
    click: (button?: unknown) => Promise<void>;
  };
  screen: {
    grab: () => Promise<unknown>;
  };
  Button?: Record<string, unknown>;
  Key?: Record<string, unknown>;
  Point?: new (x: number, y: number) => unknown;
};

export type NutAutomationOptions = {
  platform: FluentPlatform;
  openApp?: (appName: string) => Promise<unknown>;
  getActiveWindow?: () => Promise<unknown>;
};

export function createNutAutomationAdapter(
  options: NutAutomationOptions
): AutomationAdapter {
  return {
    id: `nut-js-${options.platform}`,
    platform: options.platform,

    getCapabilities() {
      return baseCapabilities(options.platform);
    },

    async execute(action: AutomationAction): Promise<AutomationResult> {
      try {
        const nut = await loadNutJs();
        const output = await executeNutAction(nut, action, options);

        return {
          actionId: action.id,
          capability: action.capability,
          ok: true,
          output
        };
      } catch (error) {
        return {
          actionId: action.id,
          capability: action.capability,
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };
}

async function loadNutJs(): Promise<NutModule> {
  try {
    return (await import("@nut-tree-fork/nut-js")) as NutModule;
  } catch {
    throw new Error(
      "Real automation requires optional peer dependency @nut-tree-fork/nut-js."
    );
  }
}

async function executeNutAction(
  nut: NutModule,
  action: AutomationAction,
  options: NutAutomationOptions
): Promise<unknown> {
  switch (action.capability) {
    case "keyboard.typeText":
      await nut.keyboard.type(action.text);
      return { typed: action.text.length };

    case "keyboard.pressShortcut": {
      const keys = action.keys.map((key) => resolveKey(nut, key));
      await nut.keyboard.pressKey(...keys);
      await nut.keyboard.releaseKey(...keys);
      return { keys: action.keys };
    }

    case "mouse.move": {
      const point = nut.Point
        ? new nut.Point(action.x, action.y)
        : { x: action.x, y: action.y };
      await nut.mouse.setPosition(point);
      return { x: action.x, y: action.y };
    }

    case "mouse.click":
      await nut.mouse.click(resolveButton(nut, action.button ?? "left"));
      return { button: action.button ?? "left" };

    case "screen.screenshot":
      return nut.screen.grab();

    case "window.getActive":
      if (!options.getActiveWindow) {
        return { supported: false };
      }

      return options.getActiveWindow();

    case "app.open":
      if (!options.openApp) {
        return { supported: false, appName: action.appName };
      }

      return options.openApp(action.appName);
  }
}

function resolveButton(nut: NutModule, button: "left" | "right" | "middle"): unknown {
  const buttonMap = nut.Button ?? {};

  return buttonMap[button.toUpperCase()] ?? buttonMap[button] ?? button;
}

function resolveKey(nut: NutModule, key: string): unknown {
  const keyMap = nut.Key ?? {};
  const normalized = key.length === 1 ? key.toUpperCase() : key;

  return keyMap[normalized] ?? keyMap[key] ?? key;
}

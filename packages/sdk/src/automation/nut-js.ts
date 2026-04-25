import {
  AutomationAction,
  AutomationResult,
  FluentPlatform
} from "../types.js";
import { baseCapabilities } from "./capabilities.js";
import { AutomationAdapter, AutomationReadiness } from "./types.js";

type NutModule = {
  keyboard: {
    type: (...text: string[]) => Promise<void>;
    pressKey: (...keys: unknown[]) => Promise<void>;
    releaseKey: (...keys: unknown[]) => Promise<void>;
  };
  mouse: {
    setPosition: (point: unknown) => Promise<void>;
    click: (button?: unknown) => Promise<void>;
    doubleClick?: (button?: unknown) => Promise<void>;
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
  readClipboardText?: () => Promise<string>;
  writeClipboardText?: (text: string) => Promise<unknown>;
  revealPath?: (path: string) => Promise<unknown>;
  getReadiness?: () => Promise<AutomationReadiness> | AutomationReadiness;
};

export function createNutAutomationAdapter(options: NutAutomationOptions): AutomationAdapter {
  return {
    id: `nut-js-${options.platform}`,
    platform: options.platform,

    getCapabilities() {
      return baseCapabilities(options.platform);
    },

    async getReadiness() {
      if (options.getReadiness) {
        return options.getReadiness();
      }

      return createReadyReadiness(options.platform);
    },

    async execute(action: AutomationAction): Promise<AutomationResult> {
      try {
        const platformOutput = await executePlatformAction(action, options);
        const output =
          platformOutput.handled
            ? platformOutput.output
            : await executeNutAction(await loadNutJs(), action);

        return {
          actionId: action.id,
          capability: action.capability,
          ok: true,
          status: "success",
          output
        };
      } catch (error) {
        return {
          actionId: action.id,
          capability: action.capability,
          ok: false,
          status: error instanceof UnsupportedAutomationError ? "unsupported" : "failed",
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
  action: AutomationAction
): Promise<unknown> {
  switch (action.capability) {
    case "keyboard.typeText":
      await nut.keyboard.type(action.text);
      return { typed: action.text.length };

    case "keyboard.pressKey": {
      const key = resolveKey(nut, action.key);
      await nut.keyboard.pressKey(key);
      await nut.keyboard.releaseKey(key);
      return { key: action.key };
    }

    case "keyboard.pressShortcut": {
      const keys = action.keys.map((key) => resolveKey(nut, key));
      await nut.keyboard.pressKey(...keys);
      await nut.keyboard.releaseKey(...keys);
      return { keys: action.keys };
    }

    case "mouse.move": {
      const point = nut.Point ? new nut.Point(action.x, action.y) : { x: action.x, y: action.y };
      await nut.mouse.setPosition(point);
      return { x: action.x, y: action.y };
    }

    case "mouse.click":
      await nut.mouse.click(resolveButton(nut, action.button ?? "left"));
      return { button: action.button ?? "left" };

    case "mouse.doubleClick": {
      const button = resolveButton(nut, action.button ?? "left");
      if (nut.mouse.doubleClick) {
        await nut.mouse.doubleClick(button);
      } else {
        await nut.mouse.click(button);
        await nut.mouse.click(button);
      }
      return { button: action.button ?? "left" };
    }

    case "screen.screenshot":
      return nut.screen.grab();

    default:
      throw new UnsupportedAutomationError(`Capability ${action.capability} is not handled by nut.js.`);
  }
}

async function executePlatformAction(
  action: AutomationAction,
  options: NutAutomationOptions
): Promise<{ handled: true; output: unknown } | { handled: false }> {
  switch (action.capability) {
    case "window.getActive":
      if (!options.getActiveWindow) {
        throw new UnsupportedAutomationError("Active window inspection is not configured for this adapter.");
      }
      return { handled: true, output: await options.getActiveWindow() };

    case "app.open":
      if (!options.openApp) {
        throw new UnsupportedAutomationError("App launch is not configured for this adapter.");
      }
      return { handled: true, output: await options.openApp(action.appName) };

    case "clipboard.readText":
      if (!options.readClipboardText) {
        throw new UnsupportedAutomationError("Clipboard read is not configured for this adapter.");
      }
      return { handled: true, output: { text: await options.readClipboardText() } };

    case "clipboard.writeText":
      if (!options.writeClipboardText) {
        throw new UnsupportedAutomationError("Clipboard write is not configured for this adapter.");
      }
      return { handled: true, output: await options.writeClipboardText(action.text) };

    case "filesystem.revealPath":
      if (!options.revealPath) {
        throw new UnsupportedAutomationError("Filesystem reveal is not configured for this adapter.");
      }
      return { handled: true, output: await options.revealPath(action.path) };

    default:
      return { handled: false };
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

class UnsupportedAutomationError extends Error {}

function createReadyReadiness(platform: FluentPlatform) {
  return {
    platform,
    ok: true,
    checks: [
      {
        name: "adapter",
        status: "ready" as const,
        message: "Automation adapter is configured."
      }
    ]
  };
}

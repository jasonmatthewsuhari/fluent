import { FluentPlatform } from "../types.js";
import { AutomationCapability } from "./types.js";

export function baseCapabilities(platform: FluentPlatform): AutomationCapability[] {
  return [
    {
      name: "keyboard.typeText",
      platform,
      description: "Type text into the active desktop target.",
      risk: "input",
      available: true,
      requiresConfirmation: true
    },
    {
      name: "keyboard.pressKey",
      platform,
      description: "Press and release a single keyboard key.",
      risk: "input",
      available: true,
      requiresConfirmation: true
    },
    {
      name: "keyboard.pressShortcut",
      platform,
      description: "Press a keyboard shortcut.",
      risk: "input",
      available: true,
      requiresConfirmation: true
    },
    {
      name: "mouse.move",
      platform,
      description: "Move the pointer to screen coordinates.",
      risk: "input",
      available: true,
      requiresConfirmation: true
    },
    {
      name: "mouse.click",
      platform,
      description: "Click at the current pointer location.",
      risk: "input",
      available: true,
      requiresConfirmation: true
    },
    {
      name: "mouse.doubleClick",
      platform,
      description: "Double-click at the current pointer location.",
      risk: "input",
      available: true,
      requiresConfirmation: true
    },
    {
      name: "screen.screenshot",
      platform,
      description: "Capture the current screen.",
      risk: "read",
      available: true,
      requiresConfirmation: false
    },
    {
      name: "window.getActive",
      platform,
      description: "Read the active window context when supported.",
      risk: "read",
      available: true,
      requiresConfirmation: false
    },
    {
      name: "app.open",
      platform,
      description: "Open an application by name or command.",
      risk: "state_change",
      available: true,
      requiresConfirmation: true
    },
    {
      name: "clipboard.readText",
      platform,
      description: "Read text from the system clipboard.",
      risk: "read",
      available: true,
      requiresConfirmation: false
    },
    {
      name: "clipboard.writeText",
      platform,
      description: "Write text to the system clipboard.",
      risk: "state_change",
      available: true,
      requiresConfirmation: true
    },
    {
      name: "filesystem.revealPath",
      platform,
      description: "Reveal a file or folder in the platform file manager.",
      risk: "state_change",
      available: true,
      requiresConfirmation: true
    }
  ];
}

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
    }
  ];
}

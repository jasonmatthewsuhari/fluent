import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { FluentPlatform } from "../types.js";
import { createNutAutomationAdapter, NutAutomationOptions } from "./nut-js.js";

const execFileAsync = promisify(execFile);

export function createWindowsAutomationAdapter() {
  return createNutAutomationAdapter({
    platform: "windows",
    openApp: (appName) => execFileAsync("cmd.exe", ["/c", "start", "", appName])
  });
}

export function createMacOSAutomationAdapter() {
  return createNutAutomationAdapter({
    platform: "macos",
    openApp: (appName) => execFileAsync("open", ["-a", appName])
  });
}

export function createLinuxAutomationAdapter() {
  return createNutAutomationAdapter({
    platform: "linux",
    openApp: (appName) => execFileAsync(appName, [])
  });
}

export function createCurrentPlatformAutomationAdapter() {
  const platform = detectPlatform();

  if (platform === "windows") {
    return createWindowsAutomationAdapter();
  }

  if (platform === "macos") {
    return createMacOSAutomationAdapter();
  }

  return createLinuxAutomationAdapter();
}

export function detectPlatform(): FluentPlatform {
  if (process.platform === "win32") {
    return "windows";
  }

  if (process.platform === "darwin") {
    return "macos";
  }

  return "linux";
}

export type { NutAutomationOptions };

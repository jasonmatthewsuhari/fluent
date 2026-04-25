import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import { FluentPlatform } from "../types.js";
import {
  createNutAutomationAdapter,
  NutAutomationOptions
} from "./nut-js.js";

const execFileAsync = promisify(execFile);

export function createWindowsAutomationAdapter() {
  return createNutAutomationAdapter({
    platform: "windows",
    openApp: (appName) => execFileAsync("cmd.exe", ["/c", "start", "", appName]),
    getActiveWindow: getWindowsActiveWindow,
    readClipboardText: () => execText("powershell.exe", ["-NoProfile", "-Command", "Get-Clipboard -Raw"]),
    writeClipboardText: (text) =>
      execFileAsync("powershell.exe", ["-NoProfile", "-Command", "Set-Clipboard -Value $args[0]", text]),
    revealPath: (targetPath) => execFileAsync("explorer.exe", [`/select,${targetPath}`]),
    getReadiness: () => createWindowsReadiness()
  });
}

export function createMacOSAutomationAdapter() {
  return createNutAutomationAdapter({
    platform: "macos",
    openApp: (appName) => execFileAsync("open", ["-a", appName]),
    getActiveWindow: getMacOSActiveWindow,
    readClipboardText: () => execText("pbpaste", []),
    writeClipboardText: (text) => execWithInput("pbcopy", [], text),
    revealPath: (targetPath) => execFileAsync("open", ["-R", targetPath]),
    getReadiness: () => createCommandReadiness("macos", ["open", "pbpaste", "pbcopy"])
  });
}

export function createLinuxAutomationAdapter() {
  return createNutAutomationAdapter({
    platform: "linux",
    openApp: (appName) => execFileAsync(appName, []),
    getActiveWindow: getLinuxActiveWindow,
    readClipboardText: readLinuxClipboard,
    writeClipboardText: writeLinuxClipboard,
    revealPath: (targetPath) => execFileAsync("xdg-open", [targetPath]),
    getReadiness: () => createCommandReadiness("linux", ["xdg-open"])
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

async function getWindowsActiveWindow() {
  const script = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class Win32 {
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
}
"@
$handle = [Win32]::GetForegroundWindow()
$buffer = New-Object System.Text.StringBuilder 1024
[void][Win32]::GetWindowText($handle, $buffer, $buffer.Capacity)
$processId = 0
[void][Win32]::GetWindowThreadProcessId($handle, [ref]$processId)
$process = Get-Process -Id $processId -ErrorAction SilentlyContinue
[PSCustomObject]@{
  title = $buffer.ToString()
  processId = $processId
  processName = $process.ProcessName
} | ConvertTo-Json -Compress
`;
  return JSON.parse(await execText("powershell.exe", ["-NoProfile", "-Command", script]));
}

async function getMacOSActiveWindow() {
  const script = `tell application "System Events"
set frontApp to first application process whose frontmost is true
set appName to name of frontApp
set windowTitle to ""
try
  set windowTitle to name of front window of frontApp
end try
return appName & "\t" & windowTitle
end tell`;
  const output = await execText("osascript", ["-e", script]);
  const [processName, title] = output.trim().split("\t");

  return {
    processName,
    title
  };
}

async function getLinuxActiveWindow() {
  const output = await execText("sh", [
    "-c",
    "command -v xdotool >/dev/null 2>&1 && xdotool getactivewindow getwindowname || true"
  ]);

  if (!output.trim()) {
    return {
      supported: false,
      reason: "xdotool is not available."
    };
  }

  return {
    title: output.trim()
  };
}

async function readLinuxClipboard() {
  return execText("sh", [
    "-c",
    "if command -v wl-paste >/dev/null 2>&1; then wl-paste; elif command -v xclip >/dev/null 2>&1; then xclip -selection clipboard -o; else exit 127; fi"
  ]);
}

async function writeLinuxClipboard(text: string) {
  return execWithInput(
    "sh",
    [
      "-c",
      "if command -v wl-copy >/dev/null 2>&1; then wl-copy; elif command -v xclip >/dev/null 2>&1; then xclip -selection clipboard -i; else exit 127; fi"
    ],
    text
  );
}

async function createWindowsReadiness() {
  const checks = [
    {
      name: "powershell",
      status: (await commandAvailable("powershell.exe")) ? "ready" as const : "missing_dependency" as const,
      message: "PowerShell is used for clipboard and active window inspection."
    },
    {
      name: "explorer",
      status: (await commandAvailable("explorer.exe")) ? "ready" as const : "missing_dependency" as const,
      message: "Explorer is used to reveal files and folders."
    }
  ];

  return {
    platform: "windows" as const,
    ok: checks.every((check) => check.status === "ready"),
    checks
  };
}

async function createCommandReadiness(platform: FluentPlatform, commands: string[]) {
  const checks = await Promise.all(
    commands.map(async (command) => ({
      name: command,
      status: (await commandAvailable(command)) ? "ready" as const : "missing_dependency" as const,
      message: `${command} is required for ${platform} automation support.`
    }))
  );

  return {
    platform,
    ok: checks.every((check) => check.status === "ready"),
    checks
  };
}

async function commandAvailable(command: string): Promise<boolean> {
  const probe =
    process.platform === "win32"
      ? ["where.exe", [command]]
      : ["sh", ["-c", `command -v ${command} >/dev/null 2>&1`]];

  try {
    await execFileAsync(probe[0] as string, probe[1] as string[]);
    return true;
  } catch {
    return false;
  }
}

async function execText(command: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync(command, args, {
    windowsHide: true,
    maxBuffer: 10 * 1024 * 1024
  });

  return stdout;
}

function execWithInput(command: string, args: string[], input: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${command} exited with code ${code}: ${stderr}`));
      }
    });

    child.stdin.end(input);
  });
}

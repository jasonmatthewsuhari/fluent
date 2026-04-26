import { describe, expect, it } from "vitest";
import { createMockAutomationAdapter } from "./mock.js";
import { createCapabilityRegistry } from "./registry.js";

describe("automation capability registry", () => {
  it("reports platform capabilities", async () => {
    const registry = createCapabilityRegistry([
      createMockAutomationAdapter("windows"),
      createMockAutomationAdapter("macos")
    ]);
    const capabilities = await registry.getCapabilities("windows");

    expect(capabilities.every((capability) => capability.platform === "windows")).toBe(true);
    expect(capabilities.map((capability) => capability.name)).toContain("keyboard.typeText");
    expect(capabilities.map((capability) => capability.name)).toContain("clipboard.writeText");
    expect(capabilities.map((capability) => capability.name)).toContain("filesystem.revealPath");
  });

  it("reports adapter readiness", async () => {
    const registry = createCapabilityRegistry([createMockAutomationAdapter("windows")]);
    const readiness = await registry.getReadiness("windows");

    expect(readiness).toHaveLength(1);
    expect(readiness[0].ok).toBe(true);
    expect(readiness[0].checks[0].status).toBe("ready");
  });

  it("executes an available capability", async () => {
    const registry = createCapabilityRegistry([createMockAutomationAdapter("linux")]);
    const result = await registry.execute(
      {
        id: "action_1",
        capability: "window.getActive",
        risk: "read"
      },
      "linux"
    );

    expect(result.ok).toBe(true);
    expect(result.status).toBe("success");
    expect(result.capability).toBe("window.getActive");
  });

  it("returns unsupported when no adapter can execute a capability", async () => {
    const registry = createCapabilityRegistry([]);
    const result = await registry.execute({
      id: "action_missing",
      capability: "clipboard.readText",
      risk: "read"
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe("unsupported");
  });
});

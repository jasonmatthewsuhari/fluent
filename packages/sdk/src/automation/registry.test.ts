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
    expect(result.capability).toBe("window.getActive");
  });
});

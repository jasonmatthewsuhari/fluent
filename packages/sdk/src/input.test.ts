import { describe, expect, it } from "vitest";
import { input } from "./input.js";

describe("input", () => {
  it("normalizes text into a natural language intent", () => {
    const intent = input.fromText("  Open   Notepad  ");

    expect(intent.modality).toBe("text");
    expect(intent.normalizedText).toBe("Open Notepad");
    expect(intent.confidence).toBe(1);
  });

  it("rejects empty text", () => {
    expect(() => input.fromText("   ")).toThrow("Text input cannot be empty.");
  });
});

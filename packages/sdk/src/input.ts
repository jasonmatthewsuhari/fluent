import { createId } from "./ids.js";
import { NaturalLanguageIntent } from "./types.js";

export type TextInputOptions = {
  metadata?: Record<string, unknown>;
};

export function fromText(text: string, options: TextInputOptions = {}): NaturalLanguageIntent {
  const normalizedText = text.trim().replace(/\s+/g, " ");

  if (!normalizedText) {
    throw new Error("Text input cannot be empty.");
  }

  return {
    id: createId("intent"),
    modality: "text",
    text,
    normalizedText,
    createdAt: new Date().toISOString(),
    confidence: 1,
    metadata: options.metadata ?? {}
  };
}

export const input = {
  fromText
};

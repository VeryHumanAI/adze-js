import { PromptAttributes } from "../Prompt";

export const defaultPromptAttributes: PromptAttributes = {
  frequencyPenalty: 0,
  maximumLength: 1024,
  model: "gpt-4",
  presencePenalty: 0,
  prompt: "",
  temperature: 0.7,
  topP: 1,
};

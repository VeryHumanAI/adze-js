import fs from "fs";
import path from "path";
import { Prompt } from "./Prompt";
import { Assistant } from "./Assistant";
import { Message } from "./MessageHandler";
import { defaultRefinementPrompt } from "./constants";

export interface RefinementOptions {
  comments: string[];
  defaultRefinementPrompt?: Prompt;
}

export interface RefinementResult {
  description: string;
  refinementStatement: string;
  title: string;
  updatedPrompt: string;
}

export class Refinement {
  private assistant: Assistant;
  private comments: string[];
  private promptSettings: Prompt;
  private refinementPrompt: Prompt;
  private refinementsPath: string;

  constructor(
    promptSettings: Prompt,
    refinementsPath: string,
    options: RefinementOptions,
  ) {
    this.comments = options.comments;
    this.promptSettings = promptSettings;
    this.refinementsPath = refinementsPath;
    this.refinementPrompt =
      options.defaultRefinementPrompt || defaultRefinementPrompt;

    this.assistant = new Assistant(process.env.OPENAI_API_KEY);
  }

  public async refine(messages: Message[]): Promise<RefinementResult> {
    // Prepare the prompt with string interpolation
    const prompt = this.refinementPrompt.prompt
      .replace("{{ PROJECT_CONTEXT_GOALS }}", "Your project context and goals")
      .replace("{{ CURRENT_SYSTEM_PROMPT }}", this.promptSettings.prompt)
      .replace("{{ PROMPT_COMMENTS_REQUESTS }}", this.comments.join("\n"));

    // Update the promptSettings with the interpolated prompt
    const promptWithVars: Prompt = { ...this.promptSettings, ...{ prompt } };

    // Call the Assistant API to refine the prompt
    const response = await this.assistant.generate(promptWithVars, messages);

    // ...
    // From the AI response, extract the desired values and return the `RefinementResult` object

    // Save the returned refinement to a refinement.json file
    // ...
  }
}

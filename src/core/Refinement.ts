import { Assistant } from "./Assistant";
import { Message } from "./MessageHandler";
import { Prompt, PromptAttributes } from "./Prompt";
import { defaultRefinementPrompt } from "./constants";

type RefinementOptions = {
  currentPrompt: Prompt;
  messages: Message[];
  refinementPromptOverrides?: Partial<PromptAttributes>;
};

type RefinementResult = {
  description: string;
  refinementStatement: string;
  title: string;
  updatedPrompt: string;
};

class Refinement {
  private assistant: Assistant;
  private currentPrompt: Prompt;
  private messages: Message[];
  private refinementPrompt: Prompt;

  constructor(options: RefinementOptions) {
    this.assistant = new Assistant(process.env.OPENAI_API_KEY as string);
    this.currentPrompt = options.currentPrompt;
    this.messages = options.messages;
    this.refinementPrompt = new Prompt({
      ...defaultRefinementPrompt,
      ...options.refinementPromptOverrides,
    } as PromptAttributes);
  }

  public async refine(comments: string[]): Promise<RefinementResult> {
    if (comments.length === 0) {
      throw new Error("At least one comment is required for refinement.");
    }

    const updatedRefinementPrompt = this.refinementPrompt.withUpdatedPrompt({
      CURRENT_SYSTEM_PROMPT: JSON.stringify(this.currentPrompt.toJSON()),
      PROMPT_COMMENTS_REQUESTS: comments
        .map((comment) => `- ${comment}`)
        .join("\n"),
    });

    const response = await this.assistant.createResponse(
      updatedRefinementPrompt,
      this.messages,
    );

    return this.parseResponse(response);
  }

  private parseResponse(response: string): RefinementResult {
    try {
      const refinementResult = JSON.parse(response) as RefinementResult;

      if (!this.validateResult(refinementResult)) {
        throw new Error("Invalid response received from OpenAI API.");
      }

      return refinementResult;
    } catch (error: any) {
      throw new Error(
        `Error parsing response from OpenAI API: ${error.message}`,
      );
    }
  }

  private validateResult(response: RefinementResult): boolean {
    if (!response) return false;

    const requiredKeys = [
      "description",
      "refinementStatement",
      "title",
      "updatedPrompt",
    ];

    for (const key of requiredKeys) {
      if (
        !Object.prototype.hasOwnProperty.call(response, key) ||
        typeof response[key as keyof RefinementResult] !== "string" ||
        response[key as keyof RefinementResult] === ""
      ) {
        return false;
      }
    }

    // Return true if all checks pass
    return true;
  }
}

export { Refinement, RefinementOptions, RefinementResult };

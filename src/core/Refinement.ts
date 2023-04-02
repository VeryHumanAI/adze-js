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

    const refinementPrompt = this.refinementPrompt.withUpdatedPrompt({
      CURRENT_SYSTEM_PROMPT: JSON.stringify(this.currentPrompt.toJSON()),
      PROMPT_COMMENTS_REQUESTS: comments
        .map((comment) => `- ${comment}`)
        .join("\n"),
    });

    const response = await this.assistant.createResponse(
      this.refinementPrompt,
      this.messages,
    );

    if (!this.validateResponse(response)) {
      throw new Error("Invalid response received from OpenAI API.");
    }

    return refinementResult;
  }

  private validateResponse(response: RefinementResult): boolean {
    // Add more validation checks if needed
    return (
      response.description !== "" &&
      response.refinementStatement !== "" &&
      response.title !== "" &&
      response.updatedPrompt !== ""
    );
  }
}

export { Refinement, RefinementOptions, RefinementResult };

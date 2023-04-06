import { Assistant } from "../Assistant";
import { Message } from "../MessageHandler";
import { Prompt } from "../Prompt";
import { Refinement, RefinementOptions, RefinementResult } from "../Refinement";
import { defaultPromptAttributes } from "../constants";

const mockAssistantCreateResponse = jest.fn();
jest.mock("../Assistant", () => {
  return {
    Assistant: jest.fn().mockImplementation(() => {
      return { createResponse: mockAssistantCreateResponse };
    }),
  };
});

const OPENAI_API_KEY = "fake-api-key";
process.env.OPENAI_API_KEY = OPENAI_API_KEY;

describe("Refinement", () => {
  let currentPrompt: Prompt;
  let messages: Message[];
  let options: RefinementOptions;
  let refinement: Refinement;

  beforeEach(() => {
    currentPrompt = new Prompt({
      ...defaultPromptAttributes,
      prompt: "This is the current system prompt.",
    });

    messages = [
      { content: "User message 1", role: "user" },
      { content: "Assistant message 1", role: "assistant" },
    ];

    refinement = new Refinement({ currentPrompt, messages });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("refine", () => {
    it("throws an error if no comments are provided", async () => {
      await expect(refinement.refine([])).rejects.toThrow(
        "At least one comment is required for refinement.",
      );
    });

    it("returns a valid refinement result when given valid input", async () => {
      const comments = ["I liked this part, but not that part."];
      const validResponse: RefinementResult = {
        description: "A better system prompt",
        refinementStatement: "The updated prompt should...",
        title: "Improved Prompt",
        updatedPrompt: "This is the updated system prompt.",
      };

      mockAssistantCreateResponse.mockResolvedValueOnce(
        JSON.stringify(validResponse),
      );

      const result = await refinement.refine(comments);
      expect(result).toEqual(validResponse);
    });

    it("throws an error if the OpenAI API response is invalid", async () => {
      const comments = ["I liked this part, but not that part."];
      const invalidResponse = { missingKeys: true };

      mockAssistantCreateResponse.mockResolvedValueOnce(
        JSON.stringify(invalidResponse),
      );

      await expect(refinement.refine(comments)).rejects.toThrow(
        "Invalid response received from OpenAI API.",
      );
    });

    it("throws an error if the OpenAI API response cannot be parsed", async () => {
      const comments = ["I liked this part, but not that part."];
      const invalidJSON = "{ badJSON: true }";

      mockAssistantCreateResponse.mockResolvedValueOnce(invalidJSON);

      await expect(refinement.refine(comments)).rejects.toThrow(
        "Error parsing response from OpenAI API:",
      );
    });
  });
});

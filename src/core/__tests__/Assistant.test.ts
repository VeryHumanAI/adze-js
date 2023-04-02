import { Assistant } from "../Assistant";
import { Message } from "../MessageHandler";
import { Prompt } from "../Prompt";
import {
  defaultCompletionMessage,
  defaultPromptAttributes,
} from "../constants";

const createChatCompletionMock = jest.fn();

jest.mock("openai", () => {
  return {
    Configuration: jest.fn(),
    OpenAIApi: jest.fn().mockImplementation(() => ({
      createChatCompletion: createChatCompletionMock,
    })),
  };
});

describe("Assistant", () => {
  const API_KEY = "dummy_api_key";
  const testAssistant = new Assistant(API_KEY);

  beforeEach(() => {
    createChatCompletionMock.mockReset();
  });

  it("should return a chat completion response", async () => {
    createChatCompletionMock.mockResolvedValue({
      data: {
        id: "1234",
        object: "test",
        created: 1234,
        model: "gpt-test",
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        choices: [
          {
            message: {
              content: "Test response",
            },
          },
        ],
      },
    });

    const messages: Message[] = [{ role: "user", content: "Test message" }];
    const result = await testAssistant.createResponse(
      new Prompt(defaultPromptAttributes),
      messages,
    );
    expect(result).toBe("Test response");
  });

  it("should return a default response when chat completion is not available", async () => {
    createChatCompletionMock.mockResolvedValue({
      data: {
        id: "1234",
        object: "test",
        created: 1234,
        model: "gpt-test",
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        choices: [],
      },
    });

    const messages: Message[] = [{ role: "user", content: "Test message" }];
    const result = await testAssistant.createResponse(
      new Prompt(defaultPromptAttributes),
      messages,
    );
    expect(result).toBe(defaultCompletionMessage);
  });
});

import { Configuration, OpenAIApi } from "openai";
import { Message } from "./MessageHandler";
import { Prompt } from "./Prompt";
import { defaultCompletionMessage } from "./constants";

export class Assistant {
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    this.openai = new OpenAIApi(new Configuration({ apiKey }));
  }

  public async createResponse(
    prompt: Prompt,
    messages: Message[],
    values?: { [key: string]: string },
  ): Promise<string> {
    const response = await this.openai.createChatCompletion({
      ...prompt.toJSON(values),
      messages,
    } as any);

    return (
      response?.data?.choices[0]?.message?.content || defaultCompletionMessage
    );
  }
}

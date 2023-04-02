import { OpenAIApi, Configuration } from "openai";
import { Message } from "./MessageHandler";

export class Assistant {
  public defaultMessage: string = "Sorry, I am unable to provide a response.";
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    this.openai = new OpenAIApi(new Configuration({ apiKey }));
  }

  public async createResponse(
    promptSettings: any,
    messages: Message[],
  ): Promise<string> {
    const response = await this.openai.createChatCompletion({
      model: promptSettings.model,
      messages: messages,
    });

    return response?.data?.choices[0]?.message?.content || this.defaultMessage;
  }
}

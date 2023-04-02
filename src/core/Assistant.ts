import { Configuration, OpenAIApi } from "openai";
import { Message } from "./MessageHandler";
import { Prompt } from "./Prompt";

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
    try {
      const { prompt: systemPrompt, ...config } = prompt.toJSON(values);
      const response = await this.openai.createChatCompletion({
        ...config,
        messages: [
          {
            content: systemPrompt as string,
            role: "system",
          },
        ].concat(messages),
      } as any);

      if (response?.data?.choices[0]?.message?.content) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error("Invalid content in OpenAI API response.");
      }
    } catch (error: any) {
      throw new Error(
        `Error creating response from OpenAI API: ${error.message}`,
      );
    }
  }
}

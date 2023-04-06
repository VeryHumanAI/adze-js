import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";

export interface Message {
  content: string;
  role: "user" | "assistant";
}

export class MessageHandler {
  private messages: Message[];
  private messagesFilePath: string;

  constructor(messagesFilePath: string) {
    this.messagesFilePath = messagesFilePath;
    this.messages = [];
  }

  public async addMessage(message: Message): Promise<void> {
    this.messages.push(message);
    this.writeMessages();
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public async readMessages(): Promise<Message[]> {
    const fileExists = await exists(this.messagesFilePath, {
      dir: BaseDirectory.Desktop,
    });

    if (fileExists) {
      const messageContents = await readTextFile(this.messagesFilePath, {
        dir: BaseDirectory.Desktop,
      });

      this.messages = JSON.parse(messageContents).messages;

      return this.messages;
    } else {
      return [];
    }
  }

  private async writeMessages(): void {
    await writeTextFile(
      this.messagesFilePath,
      JSON.stringify({ messages: this.messages }, null, 2),
      { dir: BaseDirectory.Desktop },
    );
  }
}

import fs from "fs";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export class MessageHandler {
  private messages: Message[];
  private messagesFilePath: string;

  constructor(messagesFilePath: string) {
    this.messagesFilePath = messagesFilePath;
    this.messages = this.readMessages();
  }

  private readMessages(): Message[] {
    if (fs.existsSync(this.messagesFilePath)) {
      return JSON.parse(fs.readFileSync(this.messagesFilePath, "utf8"))
        .messages;
    } else {
      return [];
    }
  }

  public addMessage(role: "user" | "assistant", content: string): void {
    this.messages.push({ role, content });
    this.writeMessages();
  }

  private writeMessages(): void {
    fs.writeFileSync(
      this.messagesFilePath,
      JSON.stringify({ messages: this.messages }, null, 2),
    );
  }

  public getMessages(): Message[] {
    return this.messages;
  }
}

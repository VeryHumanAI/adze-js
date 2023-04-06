import fs from "fs";

export interface Message {
  content: string;
  role: "user" | "assistant";
}

export class MessageHandler {
  private messages: Message[];
  private messagesFilePath: string;

  constructor(messagesFilePath: string) {
    this.messagesFilePath = messagesFilePath;
    this.messages = this.readMessages();
  }

  public addMessage(message: Message): void {
    this.messages.push(message);
    // this.writeMessages();
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  private readMessages(): Message[] {
    // if (fs.existsSync(this.messagesFilePath)) {
    //   return JSON.parse(fs.readFileSync(this.messagesFilePath, "utf8"))
    //     .messages;
    // } else {
    return [];
    // }
  }

  private writeMessages(): void {
    fs.writeFileSync(
      this.messagesFilePath,
      JSON.stringify({ messages: this.messages }, null, 2),
    );
  }
}

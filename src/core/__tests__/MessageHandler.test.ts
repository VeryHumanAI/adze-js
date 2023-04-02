import { Message, MessageHandler } from "../MessageHandler";
import fs from "fs";

jest.mock("fs"); // Mock the 'fs' module

describe("MessageHandler", () => {
  const messagesFilePath = "testMessages.json";
  const testMessages = [
    { role: "user", content: "Hello, Assistant!" },
    { role: "assistant", content: "Hello, User!" },
  ];

  beforeEach(() => {
    // Mock readFileSync to return testMessages as well as writeFileSync to avoid making changes to the file system
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ messages: testMessages }),
    );
    (fs.writeFileSync as jest.Mock).mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear any saved mock state between tests
  });

  it("should read and store existing messages on instantiation", () => {
    const messageHandler = new MessageHandler(messagesFilePath);

    expect(fs.readFileSync).toHaveBeenCalledWith(messagesFilePath, "utf8");
    expect(messageHandler.getMessages()).toEqual(testMessages);
  });

  it("should properly add a message and write it to the file", () => {
    const messageHandler = new MessageHandler(messagesFilePath);
    const newMessage: Message = {
      role: "user",
      content: "What's the weather like today?",
    };

    messageHandler.addMessage(newMessage.role, newMessage.content);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      messagesFilePath,
      JSON.stringify({ messages: [...testMessages, newMessage] }, null, 2),
    );
    expect(messageHandler.getMessages()).toEqual([...testMessages, newMessage]);
  });

  it("should still work when there's no file to read", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const messageHandler = new MessageHandler(messagesFilePath);
    expect(fs.readFileSync).not.toHaveBeenCalled(); // Should not attempt reading a non-existent file
    expect(messageHandler.getMessages()).toEqual([]); // Should start with an empty message array
  });
});

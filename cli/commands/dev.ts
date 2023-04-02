import dotenv from "dotenv";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";
import path from "path";
import readline from "readline";

import { Assistant } from "../../src/core/Assistant";
import { Message, MessageHandler } from "../../src/core/MessageHandler";
import { Prompt, PromptAttributes } from "../../src/core/Prompt";

dotenv.config();

// 4. Display the prompt settings and chat history if available, then start the REPL.
const dev = async (options: { snapshotVersion?: number }) => {
  // Display current settings and chat history if available
  // Set up readline prompt, process user input, and handle REPL logic

  const openai = new OpenAIApi(
    new Configuration({ apiKey: process.env.OPENAI_API_KEY }),
  );

  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is not set in the .env file.");
    process.exit(1);
  }

  // 2. Read the existing prompt settings if available and provide default values if it's the first run:
  const promptFilePath = path.join(process.cwd(), "prompt.json");
  const messagesFilePath = path.join(process.cwd(), "messages.json");

  // Read and validate prompt.json
  let promptAttributes: PromptAttributes;
  if (fs.existsSync(promptFilePath)) {
    promptAttributes = JSON.parse(fs.readFileSync(promptFilePath, "utf8"));
    // Add validation checks here
  } else {
    // First run, set up default settings and ask user for prompt details
    // promptAttributes = {
    //   /* default settings */
    // };
  }

  // 3. Set up the readline interface and create a helper function to process user input.
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">> ",
  });

  const messageHandler = new MessageHandler(messagesFilePath);
  const assistant = new Assistant(process.env.OPENAI_API_KEY);

  const processUserInput = async (input: string) => {
    if (input.trim()) {
      messageHandler.addMessage({
        content: input,
        role: "user",
      } as Message);

      try {
        const assistantOutput = await assistant.createResponse(
          new Prompt(promptAttributes),
          messageHandler.getMessages(),
        );

        console.log(`Assistant: ${assistantOutput}`);
        messageHandler.addMessage({
          content: assistantOutput,
          role: "assistant",
        } as Message);
      } catch (error: any) {
        console.error("Error communicating with AI: ", error.message);
      }
    }
  };

  const main = async () => {
    rl.prompt();
    rl.on("line", async (line) => {
      await processUserInput(line);
      rl.prompt();
    });
  };

  main();
};

export default dev;

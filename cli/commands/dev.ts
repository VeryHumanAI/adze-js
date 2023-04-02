import dotenv from "dotenv";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";
import path from "path";
import readline from "readline";

import { Assistant } from "../../src/core/Assistant";
import { MessageHandler } from "../../src/core/MessageHandler";

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
  let promptSettings: any;
  if (fs.existsSync(promptFilePath)) {
    promptSettings = JSON.parse(fs.readFileSync(promptFilePath, "utf8"));
    // Add validation checks here
  } else {
    // First run, set up default settings and ask user for prompt details
    promptSettings = {
      /* default settings */
    };
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
      messageHandler.addMessage("user", input);

      try {
        const assistantOutput = await assistant.createResponse(
          promptSettings,
          messageHandler.getMessages(),
        );

        console.log(`Assistant: ${assistantOutput}`);
        messageHandler.addMessage("assistant", assistantOutput);
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
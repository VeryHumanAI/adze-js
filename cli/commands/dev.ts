import dotenv from "dotenv";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";
import path from "path";
import readline from "readline";

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
  let promptSettings;
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

  const processUserInput = async (input: string) => {
    // Handle user input, slash commands, and communication with the AI
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

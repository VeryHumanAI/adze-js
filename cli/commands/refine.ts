import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Refinement } from "../../src/core/Refinement";
import { MessageHandler } from "../../src/core/MessageHandler";

dotenv.config();

// Refine command action
const refine = async () => {
  const promptFilePath = path.join(process.cwd(), "prompt.json");
  const messagesFilePath = path.join(process.cwd(), "messages.json");
  const refinementsPath = path.join(process.cwd(), "refinements");

  // Read and validate prompt.json
  let promptSettings: any;
  if (fs.existsSync(promptFilePath)) {
    promptSettings = JSON.parse(fs.readFileSync(promptFilePath, "utf8"));
    // TODO: Add validation checks here
  } else {
    console.error("Error: The required prompt.json file is missing.");
    process.exit(1);
  }

  const messageHandler = new MessageHandler(messagesFilePath);
  const refinementHandler = new Refinement(promptSettings, refinementsPath);

  // TODO: Implement refine method in Refinement.ts and call here
  const updatedPromptSettings = await refinementHandler.refine(
    messageHandler.getMessages(),
    // TODO: Add user comments about the unwanted AI response
  );

  // Update prompt.json with the updated prompt settings
  fs.writeFileSync(
    promptFilePath,
    JSON.stringify(updatedPromptSettings, null, 2),
  );

  console.log("Refinement process completed. The prompt has been updated.");
};

export default refine;

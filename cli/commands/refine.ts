import dotenv from "dotenv";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { MessageHandler } from "../../src/core/MessageHandler";
import { Prompt } from "../../src/core/Prompt";
import {
  Refinement,
  RefinementOptions,
  RefinementResult,
} from "../../src/core/Refinement";

dotenv.config();

const askUserForComment = async (): Promise<string> => {
  const inquirer = await import("inquirer");
  const { comment } = await inquirer.default.prompt<{ comment: string }>({
    type: "input",
    name: "comment",
    message: "Enter your comment about the AI's response:",
  });

  return comment;
};

const confirmRefinement = async (): Promise<boolean> => {
  const inquirer = await import("inquirer");
  const { satisfied } = await inquirer.default.prompt<{ satisfied: boolean }>({
    type: "confirm",
    name: "satisfied",
    message: "Are you satisfied with the refined prompt?",
    default: true,
  });
  return satisfied;
};

// Refine command action
const refine = async () => {
  const promptFilePath = path.join(process.cwd(), "prompt.json");
  const messagesFilePath = path.join(process.cwd(), "messages.json");
  const refinementsPath = path.join(process.cwd(), "refinements");

  // Read and validate prompt.json
  let currentPrompt: Prompt;
  if (fs.existsSync(promptFilePath)) {
    const promptSettings = JSON.parse(fs.readFileSync(promptFilePath, "utf8"));
    currentPrompt = new Prompt(promptSettings);
  } else {
    console.error("Error: The required prompt.json file is missing.");
    process.exit(1);
  }

  const messageHandler = new MessageHandler(messagesFilePath);
  const refinementOptions: RefinementOptions = {
    currentPrompt,
    messages: messageHandler.getMessages(),
  };
  const refinementHandler = new Refinement(refinementOptions);

  let comments: string[] = [];
  let happyWithRefinement = false;
  let refinementResult: RefinementResult | undefined;

  while (!happyWithRefinement) {
    // Get user's comment(s) from the command line
    const comment = await askUserForComment();
    comments.push(comment);

    // Run refine on their comment array
    refinementResult = await refinementHandler.refine(comments);

    console.log("Refinement Result:", refinementResult);

    // Save the RefinementResult to a new file
    const timestamp = Date.now();
    const filename = `${timestamp}-${refinementResult.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}.json`;
    fs.writeFileSync(
      path.join(refinementsPath, filename),
      JSON.stringify(refinementResult, null, 2),
    );

    // Ask the user if they are happy with the refinement
    happyWithRefinement = await confirmRefinement();
  }

  if (refinementResult) {
    // Update prompt.json with the updated prompt settings
    fs.writeFileSync(
      promptFilePath,
      JSON.stringify(
        {
          ...currentPrompt.toJSON(),
          prompt: refinementResult.updatedPrompt,
        },
        null,
        2,
      ),
    );
  } else {
    console.error("Error: No refinement result found.");
    process.exit(1);
  }

  console.log("Refinement process completed. The prompt has been updated.");
};

export default refine;

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Test } from "../../src/core/Test";
import { MessageHandler } from "../../src/core/MessageHandler";

dotenv.config();

// Test command action
const test = async (files: string[], options: { tag?: string }) => {
  const promptFilePath = path.join(process.cwd(), "prompt.json");
  const messagesFilePath = path.join(process.cwd(), "messages.json");
  const testsPath = path.join(process.cwd(), "tests");

  // // Read and validate prompt.json
  // let promptSettings: any;
  // if (fs.existsSync(promptFilePath)) {
  //   promptSettings = JSON.parse(fs.readFileSync(promptFilePath, "utf8"));
  //   // TODO: Add validation checks here
  // } else {
  //   console.error("Error: The required prompt.json file is missing.");
  //   process.exit(1);
  // }

  // const messageHandler = new MessageHandler(messagesFilePath);
  // const testHandler = new Test(promptSettings, testsPath, options.tag);

  // // TODO: Implement test method in Test.ts to execute tests and call here
  // const testResults = await testHandler.executeTests(
  //   messageHandler.getMessages(),
  //   // TODO: Pass parameters needed for executing tests
  // );

  // TODO: Print and handle test results for success and failure cases
};

export default test;

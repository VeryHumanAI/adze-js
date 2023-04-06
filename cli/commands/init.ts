import fs from "fs";
import path from "path";
import prompts from "prompts";

async function init() {
  const response = await prompts({
    type: "text",
    name: "projectName",
    message: "What is the name of the new project (e.g., editor-ai)?",
  });

  const projectDir = path.join(process.cwd(), response.projectName);

  if (fs.existsSync(projectDir)) {
    console.error(
      `\nError: A folder with the name "${response.projectName}" already exists. Please choose a different name or delete the existing folder before running the command again.`,
    );
    process.exit(1);
  }

  fs.mkdirSync(projectDir);
  fs.mkdirSync(path.join(projectDir, "refinements"));
  fs.mkdirSync(path.join(projectDir, "snapshots"));
  fs.writeFileSync(path.join(projectDir, "snapshots", ".keep"), "");
  fs.mkdirSync(path.join(projectDir, "tests"));

  fs.copyFileSync(
    path.join(__dirname, "../templates/env.example"),
    path.join(projectDir, ".env"),
  );
  fs.copyFileSync(
    path.join(__dirname, "../templates/example-refinement.json"),
    path.join(projectDir, "refinements/0000000000-example-refinement.json"),
  );
  fs.copyFileSync(
    path.join(__dirname, "../templates/example-test.json"),
    path.join(projectDir, "tests/0000000000-example-test.json"),
  );
  fs.copyFileSync(
    path.join(__dirname, "../templates/messages.example.json"),
    path.join(projectDir, "messages.json"),
  );
  fs.copyFileSync(
    path.join(__dirname, "../templates/package.example.json"),
    path.join(projectDir, "package.json"),
  );
  fs.copyFileSync(
    path.join(__dirname, "../templates/prompt.example.json"),
    path.join(projectDir, "prompt.json"),
  );

  console.log(
    `\nProject "${response.projectName}" initialized successfully.\n`,
  );
  console.log("Next steps:");
  console.log(
    `1. Change to the new project directory: cd ${response.projectName}`,
  );
  console.log("2. Install dependencies: yarn install");
  console.log("3. Copy the .env.example file to .env and update the values");
  console.log("3. Start the development REPL: yarn dev");
}

export default init;

#!/usr/bin/env ts-node-dev
/// <reference types="node" />

import "source-map-support/register";
import { Command } from "commander";
// import build from "./build";
// import dev from "./dev";
import init from "./init";
// import refine from "./refine";
// import test from "./test";

const program = new Command();

program
  .version("0.1.0")
  .description("AdzeJS: An advanced AI prompt refinement tool for developers.");

// program
//   .command("build")
//   .description("Build a snapshot of the current prompt for deployment")
//   .action(build);

// program
//   .command("dev")
//   .description("Start the development REPL")
//   .option(
//     "-v, --version <number>",
//     "Specify a version number for the system prompt",
//   )
//   .action((options) => dev(options));

program
  .command("init")
  .description("Initialize a new AdzeJS project")
  .action(init);

// program
//   .command("refine")
//   .description("Refine the current prompt")
//   .action(refine);

// program
//   .command("test [files...]")
//   .description("Run tests for the current prompt")
//   .option("-t, --tag <tag>", "Run tests with the specified tag only")
//   .action((files, options) => test(files, options));

program.parse(process.argv);

import { defaultPromptAttributes } from "./constants";

export interface PromptAttributes {
  frequencyPenalty: number;
  maximumLength: number;
  model: string;
  presencePenalty: number;
  prompt: string;
  temperature: number;
  topP: number;
}

const supportedModels = ["gpt-3.5-turbo", "gpt-4"];

export class Prompt {
  private attributes: PromptAttributes;

  constructor(attributes: PromptAttributes) {
    this.attributes = attributes;
    this.validate();
  }

  // Interpolate prompt string with variables
  public interpolatePromptString(replacements: {
    [key: string]: string;
  }): Prompt {
    const interpolatedPrompt = Object.entries(replacements).reduce(
      (acc, [key, value]) => acc.replace(`{{ ${key} }}`, value),
      this.attributes.prompt,
    );

    return new Prompt({
      ...this.attributes,
      ...{ prompt: interpolatedPrompt },
    });
  }

  private isIncludedIn(value: string, array: string[]): boolean {
    return array.includes(value);
  }

  private isValidNumber(
    value: number,
    minValue: number,
    maxValue: number,
  ): boolean {
    return typeof value === "number" && value >= minValue && value <= maxValue;
  }

  private isValidString(
    value: string,
    minLength: number,
    maxLength: number,
  ): boolean {
    return (
      typeof value === "string" &&
      value.length >= minLength &&
      value.length <= maxLength
    );
  }

  // Validate prompt keys and values
  private validate(): void {
    const requiredKeys = Object.keys(defaultPromptAttributes);

    for (const key of requiredKeys) {
      if (!Object.prototype.hasOwnProperty.call(this.attributes, key)) {
        throw new Error(
          `Error: The required key "${key}" is missing in the prompt attributes.`,
        );
      }

      // Add additional validation based on key
      switch (key) {
        case "frequencyPenalty":
        case "presencePenalty":
          if (!this.isValidNumber(this.attributes[key], 0, 2)) {
            throw new Error(`Error: ${key} must be a number between 0 and 2.`);
          }
          break;
        case "maximumLength":
          if (!this.isValidNumber(this.attributes[key], 1, 4096)) {
            throw new Error(
              `Error: ${key} must be a number between 1 and 4096.`,
            );
          }
          break;
        case "model":
          if (!this.isIncludedIn(this.attributes[key], supportedModels)) {
            throw new Error(
              `Error: ${key} must be one of [${supportedModels.join(", ")}]]`,
            );
          }
          break;
        case "prompt":
          if (!this.isValidString(this.attributes[key], 0, 5000)) {
            throw new Error(
              `Error: ${key} must be a string with a maximum length of 5000 characters.`,
            );
          }
          break;
        case "temperature":
        case "topP":
          if (!this.isValidNumber(this.attributes[key], 0, 1)) {
            throw new Error(`Error: ${key} must be a number between 0 and 1.`);
          }
          break;
        default:
          break;
      }
    }
  }
}

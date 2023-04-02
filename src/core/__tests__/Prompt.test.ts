import { randText } from "@ngneat/falso";

import { Prompt, PromptAttributes } from "../Prompt";

const validAttributes: PromptAttributes = {
  frequencyPenalty: 0.5,
  maximumLength: 100,
  model: "gpt-3.5-turbo",
  presencePenalty: 0.5,
  prompt: "Hello World!",
  temperature: 0.7,
  topP: 0.8,
};

describe("Prompt", () => {
  it("should create a new instance with valid attributes", () => {
    expect(() => new Prompt(validAttributes)).not.toThrow();
  });

  const testCases = [
    {
      key: "frequencyPenalty",
      invalidValues: [-0.1, 2.1, null, undefined, "", "string", {}, [], NaN],
      validValues: [0, 0.5, 2],
    },
    {
      key: "maximumLength",
      invalidValues: [
        -1,
        0,
        1.5,
        2049,
        null,
        undefined,
        "",
        "string",
        {},
        [],
        NaN,
      ],
      validValues: [1, 2048],
    },
    {
      key: "model",
      invalidValues: ["invalid-model", null, undefined, "", {}, [], NaN],
      validValues: ["gpt-3.5-turbo", "gpt-4"],
    },
    {
      key: "presencePenalty",
      invalidValues: [-0.1, 2.1, null, undefined, "", "string", {}, [], NaN],
      validValues: [0, 0.5, 2],
    },
    {
      key: "prompt",
      invalidValues: [null, undefined, randText({ charCount: 5001 })],
      validValues: ["", "string", randText({ charCount: 5000 })],
    },
    {
      key: "temperature",
      invalidValues: [-0.1, 1.1, null, undefined, "", "string", {}, [], NaN],
      validValues: [0, 0.5, 1],
    },
    {
      key: "topP",
      invalidValues: [
        -1,
        -0.1,
        1.1,
        null,
        undefined,
        "",
        "string",
        {},
        [],
        NaN,
      ],
      validValues: [0, 0.5, 1],
    },
  ];

  testCases.forEach(({ key, invalidValues }) => {
    invalidValues.forEach((value) => {
      it(`${key} should throw an error for invalid value of: ${JSON.stringify(
        value,
      )}`, () => {
        const attributes = { ...validAttributes, [key]: value };
        expect(() => new Prompt(attributes)).toThrow();
      });
    });
  });

  it("returns the expect JSON format", () => {
    const prompt = new Prompt(validAttributes);
    const json = prompt.toJSON({ name: "John" });

    expect(json).toEqual({
      frequency_penalty: 0.5,
      max_tokens: 100,
      model: "gpt-3.5-turbo",
      presence_penalty: 0.5,
      prompt: "Hello World!",
      temperature: 0.7,
      top_p: 0.8,
    });
  });

  it("should interpolate prompt string correctly", () => {
    const prompt = new Prompt({
      ...validAttributes,
      prompt: "My name is {{ name }}. I live at {{ address }}.",
    });
    const json = prompt.toJSON({
      address: "742 Evergreen Terrace",
      name: "Homer Simpson",
    });

    expect(json.prompt).toBe(
      "My name is Homer Simpson. I live at 742 Evergreen Terrace.",
    );
  });
});

import { test, expect, describe } from "@jest/globals";
import { parse } from "../domain/template-engine";
import { ParseNotifier, ParseEvent } from "../domain/ports/parse-notifier";

class SpyParseNotifier implements ParseNotifier {
  public readonly events: ParseEvent[] = [];

  notify(event: ParseEvent): void {
    this.events.push(event);
  }
}

describe("The parse function", () => {
  describe("returns template unchanged when there are no replacements", () => {
    test.each([
      ["no placeholders", "Hello, world!", {}, "Hello, world!"],
      ["no variables provided", "Hello, ${name}!", {}, "Hello, ${name}!"],
      [
        "variables provided but no placeholders match",
        "Hello, ${name}!",
        { age: "21" },
        "Hello, ${name}!",
      ],
      ["template is empty", "", {}, ""],
      ["template is empty with variables", "", { name: "John" }, ""],
    ])(
      "should return the same template if %s",
      (_, template, variables, expected) => {
        const parsedText = parse(template, variables);
        expect(parsedText).toBe(expected);
      },
    );
  });

  describe("replaces placeholders successfully", () => {
    test.each([
      [
        "single placeholder",
        "Hello, ${name}!",
        { name: "John" },
        "Hello, John!",
      ],
      [
        "all occurrences of the same placeholder",
        "Hello, ${name}! Welcome, ${name}!",
        { name: "John" },
        "Hello, John! Welcome, John!",
      ],
      [
        "multiple different placeholders",
        "Here it is ${name}!, he is ${age} years old.",
        { name: "John", age: "21" },
        "Here it is John!, he is 21 years old.",
      ],
      [
        "complex template with multiple placeholders",
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
        { name: "John", age: "21", sisterAge: "25" },
        "Here it is John!, he is 21 years old and the sister of John is 25.",
      ],
    ])("should replace %s", (_, template, variables, expected) => {
      const parsedText = parse(template, variables);
      expect(parsedText).toBe(expected);
    });
  });

  describe("handles partial replacements correctly", () => {
    test.each([
      [
        "matching placeholders replaced, no matching placeholder left as is",
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
        { name: "John", sisterAge: "25" },
        "Here it is John!, he is ${age} years old and the sister of John is 25.",
      ],
      [
        "null placeholder value prevents replacement",
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
        { name: null, sisterAge: "25" },
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is 25.",
      ],
    ])("should %s", (_, template, variables, expected) => {
      const parsedText = parse(template, variables);
      expect(parsedText).toBe(expected);
    });
  });

  describe("notifies parse events using ParseNotifier", () => {
    test("should notify a success event when a replacement is done", () => {
      const notifier = new SpyParseNotifier();
      const template = "Hello, ${name}!";
      const variables = { name: "Ada" };

      const result = parse(template, variables, notifier);

      expect(result).toBe("Hello, Ada!");
      expect(notifier.events).toEqual([
        {
          type: "SUCCESS",
          message: "Replaced ${name} with 'Ada'",
        },
      ]);
    });

    test("should notify a warning event when a placeholder variable is null", () => {
      const notifier = new SpyParseNotifier();
      const template = "Hello, ${name}!";
      const variables = { name: null };

      const result = parse(template, variables, notifier);

      expect(result).toBe("Hello, ${name}!");
      expect(notifier.events).toEqual([
        {
          type: "WARNING",
          message: "No replacements done! key ${name} has no value.",
        },
      ]);
    });

    test("should notify a warning event when a variable is not used in the template", () => {
      const notifier = new SpyParseNotifier();
      const template = "Hello!";
      const variables = { age: "21" };

      const result = parse(template, variables, notifier);

      expect(result).toBe("Hello!");
      expect(notifier.events).toEqual([
        {
          type: "WARNING",
          message:
            "No replacements done! key ${age} not found in the template.",
        },
      ]);
    });

    test("should accumulate success and warning events across multiple variables", () => {
      const notifier = new SpyParseNotifier();
      const template = "Dear ${name}, your code is ${quality}.";
      const variables = { name: "Alice", quality: "clean", unusedVar: "foo" };

      const result = parse(template, variables, notifier);

      expect(result).toBe("Dear Alice, your code is clean.");
      expect(notifier.events).toEqual([
        {
          type: "SUCCESS",
          message: "Replaced ${name} with 'Alice'",
        },
        {
          type: "SUCCESS",
          message: "Replaced ${quality} with 'clean'",
        },
        {
          type: "WARNING",
          message:
            "No replacements done! key ${unusedVar} not found in the template.",
        },
      ]);
    });
  });
});

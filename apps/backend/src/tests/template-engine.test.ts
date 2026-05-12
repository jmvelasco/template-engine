import { test, expect, describe } from "@jest/globals";
import { parse } from "../domain/template-engine";
import { ParseNotifier, ParseEvent } from "../domain/ports/parse-notifier";

class SpyParseNotifier implements ParseNotifier {
  public readonly events: ParseEvent[] = [];

  notify(event: ParseEvent): void {
    this.events.push(event);
  }
}

describe("The Template Parser", () => {
  describe("when there are no replacements", () => {
    test("considers a template with no placeholders at all", () => {
      const template = "Hello, world!";
      const variables = {};

      const result = parse(template, variables);

      expect(result).toBe("Hello, world!");
    });

    test("considers a template with placeholders when no variables are provided", () => {
      const template = "Hello, ${name}!";
      const variables = {};

      const result = parse(template, variables);

      expect(result).toBe("Hello, ${name}!");
    });

    test("considers a template with placeholders when variables are provided but none match", () => {
      const template = "Hello, ${name}!";
      const variables = { age: "21" };

      const result = parse(template, variables);

      expect(result).toBe("Hello, ${name}!");
    });

    test("considers an empty template when no variables are provided", () => {
      const template = "";
      const variables = {};

      const result = parse(template, variables);

      expect(result).toBe("");
    });

    test("considers an empty template when some variables are provided", () => {
      const template = "";
      const variables = { name: "John" };

      const result = parse(template, variables);

      expect(result).toBe("");
    });
  });

  describe("when replacing placeholders", () => {
    test("replaces a single placeholder with its dictionary value", () => {
      const template = "Hello, ${name}!";
      const variables = { name: "John" };

      const result = parse(template, variables);

      expect(result).toBe("Hello, John!");
    });

    test("replaces all occurrences of the same placeholder in the template", () => {
      const template = "Hello, ${name}! Welcome, ${name}!";
      const variables = { name: "John" };

      const result = parse(template, variables);

      expect(result).toBe("Hello, John! Welcome, John!");
    });

    test("replaces multiple different placeholders", () => {
      const template = "Here it is ${name}!, he is ${age} years old.";
      const variables = { name: "John", age: "21" };

      const result = parse(template, variables);

      expect(result).toBe("Here it is John!, he is 21 years old.");
    });

    test("replaces placeholders in a complex template with multiple variables", () => {
      const template = "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.";
      const variables = { name: "John", age: "21", sisterAge: "25" };

      const result = parse(template, variables);

      expect(result).toBe("Here it is John!, he is 21 years old and the sister of John is 25.");
    });
  });

  describe("when handling partial replacements", () => {
    test("replaces matching placeholders while leaving unmatched placeholders intact", () => {
      const template = "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.";
      const variables = { name: "John", sisterAge: "25" };

      const result = parse(template, variables);

      expect(result).toBe("Here it is John!, he is ${age} years old and the sister of John is 25.");
    });

    test("does not replace a placeholder whose value is explicitly null", () => {
      const template = "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.";
      const variables = { name: null, sisterAge: "25" };

      const result = parse(template, variables);

      expect(result).toBe("Here it is ${name}!, he is ${age} years old and the sister of ${name} is 25.");
    });
  });

  describe("when notifying parse events using ParseNotifier", () => {
    test("emits a success event when a placeholder is replaced", () => {
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

    test("emits a warning event when a placeholder variable is null", () => {
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

    test("emits a warning event when a variable in the dictionary is not found in the template", () => {
      const notifier = new SpyParseNotifier();
      const template = "Hello!";
      const variables = { age: "21" };

      const result = parse(template, variables, notifier);

      expect(result).toBe("Hello!");
      expect(notifier.events).toEqual([
        {
          type: "WARNING",
          message: "No replacements done! key ${age} not found in the template.",
        },
      ]);
    });

    test("accumulates success and warning events across multiple variables", () => {
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
          message: "No replacements done! key ${unusedVar} not found in the template.",
        },
      ]);
    });

    test("notifies a warning when a placeholder in the template is missing from the dictionary", () => {
      const notifier = new SpyParseNotifier();
      const template = "Hello, ${name}!";
      const variables = {};

      const result = parse(template, variables, notifier);

      expect(result).toBe("Hello, ${name}!");
      expect(notifier.events).toEqual([
        {
          type: "WARNING",
          message: "No replacements done! placeholder ${name} is not defined in the dictionary.",
        },
      ]);
    });

    test("notifies distinct warnings for each unique undefined placeholder in the template", () => {
      const notifier = new SpyParseNotifier();
      const template = "Hello, ${name}! You are ${age} years old.";
      const variables = {};

      const result = parse(template, variables, notifier);

      expect(result).toBe("Hello, ${name}! You are ${age} years old.");
      expect(notifier.events).toEqual([
        {
          type: "WARNING",
          message: "No replacements done! placeholder ${name} is not defined in the dictionary.",
        },
        {
          type: "WARNING",
          message: "No replacements done! placeholder ${age} is not defined in the dictionary.",
        },
      ]);
    });

    test("notifies only once when duplicate undefined placeholders exist in the template", () => {
      const notifier = new SpyParseNotifier();
      const template = "Hello, ${name}! Welcome, ${name}!";
      const variables = {};

      const result = parse(template, variables, notifier);

      expect(result).toBe("Hello, ${name}! Welcome, ${name}!");
      expect(notifier.events).toEqual([
        {
          type: "WARNING",
          message: "No replacements done! placeholder ${name} is not defined in the dictionary.",
        },
      ]);
    });

    test("handles a mixture of defined replacements and undefined placeholder warnings seamlessly", () => {
      const notifier = new SpyParseNotifier();
      const template = "Hello, ${name}! You are ${age} years old.";
      const variables = { name: "Alice" };

      const result = parse(template, variables, notifier);

      expect(result).toBe("Hello, Alice! You are ${age} years old.");
      expect(notifier.events).toEqual([
        {
          type: "WARNING",
          message: "No replacements done! placeholder ${age} is not defined in the dictionary.",
        },
        {
          type: "SUCCESS",
          message: "Replaced ${name} with 'Alice'",
        },
      ]);
    });
  });
});

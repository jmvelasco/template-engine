import { describe, test, expect } from "@jest/globals";
import { TemplateEngine } from "../../domain/TemplateEngine";

describe("The TemplateEngine", () => {
  test("returns empty text with info notification for empty template", () => {
    const result = TemplateEngine.parse("", {});

    expect(result.text).toBe("");
    expect(result.notifications).toEqual([
      { type: "info", message: "Template is empty, nothing to process" },
    ]);
  });

  test("returns unchanged template with info when no placeholders and empty dictionary", () => {
    const result = TemplateEngine.parse("Hello, world!", {});

    expect(result.text).toBe("Hello, world!");
    expect(result.notifications).toEqual([
      { type: "info", message: "No placeholders found in template" },
    ]);
  });

  test("warns about unused keys when template has no placeholders", () => {
    const result = TemplateEngine.parse("Hello, world!", { name: "Alice", age: "30" });

    expect(result.text).toBe("Hello, world!");
    expect(result.notifications).toEqual([
      { type: "info", message: "No placeholders found in template" },
      { type: "warning", message: "Unused variable: name" },
      { type: "warning", message: "Unused variable: age" },
    ]);
  });

  test("warns about unresolved placeholders when dictionary is empty", () => {
    const result = TemplateEngine.parse("Hello, ${name}!", {});

    expect(result.text).toBe("Hello, ${name}!");
    expect(result.notifications).toEqual([
      { type: "warning", message: "Unresolved placeholder: name" },
    ]);
  });

  test("replaces a single placeholder with its matching value", () => {
    const result = TemplateEngine.parse("Hello, ${name}!", { name: "Alice" });

    expect(result.text).toBe("Hello, Alice!");
    expect(result.notifications).toEqual([
      { type: "success", message: "Replaced placeholder: name" },
    ]);
  });

  test("replaces all occurrences of the same placeholder", () => {
    const result = TemplateEngine.parse("${name} meets ${name}", { name: "Alice" });

    expect(result.text).toBe("Alice meets Alice");
    expect(result.notifications).toEqual([
      { type: "success", message: "Replaced placeholder: name" },
    ]);
  });

  test("replaces multiple different placeholders", () => {
    const result = TemplateEngine.parse("${greeting}, ${name}!", { greeting: "Hello", name: "Alice" });

    expect(result.text).toBe("Hello, Alice!");
    expect(result.notifications).toEqual([
      { type: "success", message: "Replaced placeholder: greeting" },
      { type: "success", message: "Replaced placeholder: name" },
    ]);
  });

  test("handles partial replacements with mixed resolved and unresolved", () => {
    const result = TemplateEngine.parse("${greeting}, ${name}!", { greeting: "Hello" });

    expect(result.text).toBe("Hello, ${name}!");
    expect(result.notifications).toEqual([
      { type: "warning", message: "Unresolved placeholder: name" },
      { type: "success", message: "Replaced placeholder: greeting" },
    ]);
  });

  test("skips null values and warns", () => {
    const result = TemplateEngine.parse("Hello, ${name}!", { name: null });

    expect(result.text).toBe("Hello, ${name}!");
    expect(result.notifications).toEqual([
      { type: "warning", message: "Null value for placeholder: name" },
    ]);
  });

  test("does not mutate the input dictionary", () => {
    const variables = { name: "Alice" };
    const originalVariables = { ...variables };

    TemplateEngine.parse("Hello, ${name}!", variables);

    expect(variables).toEqual(originalVariables);
  });

  test("converts escaped placeholder to literal text", () => {
    const result = TemplateEngine.parse("Use \\${name} as placeholder syntax", {});

    expect(result.text).toBe("Use ${name} as placeholder syntax");
    expect(result.notifications).toEqual([
      { type: "info", message: "No placeholders found in template" },
      { type: "info", message: "Escaped placeholder preserved as literal: name" },
    ]);
  });

  test("treats values containing placeholder syntax as literal text", () => {
    const result = TemplateEngine.parse("Value is ${x}", { x: "${y}" });

    expect(result.text).toBe("Value is ${y}");
    expect(result.notifications).toEqual([
      { type: "success", message: "Replaced placeholder: x" },
      { type: "warning", message: "Value for 'x' contains placeholder-like syntax and was inserted as literal" },
    ]);
  });

  test("ignores malformed placeholders and leaves them as-is", () => {
    const result = TemplateEngine.parse("Empty ${} and spaced ${ name } remain", {});

    expect(result.text).toBe("Empty ${} and spaced ${ name } remain");
    expect(result.notifications).toEqual([
      { type: "info", message: "No placeholders found in template" },
    ]);
  });
});

import { describe, test, expect } from "@jest/globals";
import { TemplateEngine } from "../../domain/template-engine";

describe("The TemplateEngine", () => {
  // TODO: Cases ordered from simplest to most complex
  //
  // Happy path:
  // 1. parse a template with no placeholders returns unchanged text and empty notifications
  // 2. parse an empty template returns empty text
  //
  // Single placeholder:
  // 3. single placeholder replacement returns parsed text with 'replaced' notification (key, value, occurrences: 1)
  //
  // Multiple occurrences:
  // 4. multiple occurrences of the same placeholder — occurrences count is correct
  //
  // Multiple different placeholders:
  // 5. multiple different placeholders — each produces its own 'replaced' notification
  //
  // Error/edge cases:
  // 6. missing variable — placeholder stays in text, 'missing-variable' notification produced
  // 7. null value — placeholder stays in text, 'null-value' notification produced
  // 8. unused variable — 'unused-variable' notification produced
  //
  // Mixed scenario:
  // 9. mixed: replaced + missing + null + unused in one parse call

  test("parses unchanged text from template without placeholders", () => {
    const engine = new TemplateEngine();

    const result = engine.parse("Hello, world!", {});

    expect(result.text).toBe("Hello, world!");
    expect(result.notifications).toEqual([]);
  });

  test("replaces single placeholder with corresponding variable value", () => {
    const engine = new TemplateEngine();

    const result = engine.parse("Hello, ${name}!", { name: "Ada" });

    expect(result.text).toBe("Hello, Ada!");
    expect(result.notifications).toEqual([
      { type: "replaced", key: "name", value: "Ada", occurrences: 1 },
    ]);
  });

  test("counts all occurrences when same placeholder appears multiple times", () => {
    const engine = new TemplateEngine();

    const result = engine.parse("${name} meets ${name}", { name: "Ada" });

    expect(result.text).toBe("Ada meets Ada");
    expect(result.notifications).toEqual([
      { type: "replaced", key: "name", value: "Ada", occurrences: 2 },
    ]);
  });

  test("produces separate notification for each different placeholder", () => {
    const engine = new TemplateEngine();

    const result = engine.parse("${greeting}, ${name}!", {
      greeting: "Hi",
      name: "Bob",
    });

    expect(result.text).toBe("Hi, Bob!");
    expect(result.notifications).toEqual(
      expect.arrayContaining([
        { type: "replaced", key: "greeting", value: "Hi", occurrences: 1 },
        { type: "replaced", key: "name", value: "Bob", occurrences: 1 },
      ]),
    );
  });

  test("keeps placeholder and notifies when variable is missing", () => {
    const engine = new TemplateEngine();

    const result = engine.parse("Hello, ${name}!", {});

    expect(result.text).toBe("Hello, ${name}!");
    expect(result.notifications).toEqual([
      { type: "missing-variable", key: "name" },
    ]);
  });

  test("keeps placeholder and notifies when variable value is null", () => {
    const engine = new TemplateEngine();

    const result = engine.parse("Hello, ${name}!", { name: null });

    expect(result.text).toBe("Hello, ${name}!");
    expect(result.notifications).toEqual([
      { type: "null-value", key: "name" },
    ]);
  });

  test("notifies when a provided variable has no matching placeholder", () => {
    const engine = new TemplateEngine();

    const result = engine.parse("Hello, world!", { age: "25" });

    expect(result.text).toBe("Hello, world!");
    expect(result.notifications).toEqual([
      { type: "unused-variable", key: "age" },
    ]);
  });
});

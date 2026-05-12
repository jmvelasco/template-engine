import { describe, test, expect } from "@jest/globals";
import { TemplateEngine } from "../../domain/TemplateEngine";

// TODO List (ordered simple → complex):
// 1. Empty template, empty dictionary → info "template is empty"
// 2. Template without placeholders, empty dictionary → info "no placeholders"
// 3. Template without placeholders, dictionary with keys → warning per unused key
// 4. Template with placeholders, empty dictionary → warning per unresolved placeholder
// 5. Single placeholder, matching key → replaced + success
// 6. Same placeholder repeated, one key → all replaced + single success
// 7. Multiple different placeholders, all matched → all replaced + success per key
// 8. Partial replacements → success + warnings
// 9. Null value → skip + warning
// 10. Escaped placeholder \${key} → literal ${key} + info
// 11. Value contains ${...} syntax → literal + warning
// 12. Malformed placeholders → ignored
// 13. Does not mutate input dictionary

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
});

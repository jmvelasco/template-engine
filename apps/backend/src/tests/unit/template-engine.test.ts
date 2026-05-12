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
});

import { test, expect, describe } from "@jest/globals";
import { render } from "../core/template-engine";

describe("The render function", () => {
  describe("returns template unchanged when there are no replacements", () => {
    test.each([
      ["no placeholders", "Hello, world!", {}, "Hello, world!", true],
      ["no variables provided", "Hello, ${name}!", {}, "Hello, ${name}!", false],
      [
        "variables provided but no placeholders match",
        "Hello, ${name}!",
        { age: "21" },
        "Hello, ${name}!",
        false,
      ],
      ["template is empty", "", {}, "", true],
      ["template is empty with variables", "", { name: "John" }, "", false],
    ])(
      "should return the same template if %s",
      (_, template, variables, expected, expectedIsValid) => {
        const result = render(template, variables);
        expect(result.value).toBe(expected);
        expect(result.isValid).toBe(expectedIsValid);
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
      const result = render(template, variables);
      expect(result.value).toBe(expected);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
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
      const result = render(template, variables);
      expect(result.value).toBe(expected);
      expect(result.isValid).toBe(false);
    });
  });

  describe("reports errors for invalid or missing variables", () => {
    test("accumulates errors for missing and null variables", () => {
      const result = render(
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
        {
          foo: null,
          bar: "25",
          baz: "30",
        },
      );

      expect(result.value).toBe(
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
      );
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual([
        "${foo} has no value.",
        "${bar} not found in the template.",
        "${baz} not found in the template.",
        "Unreplaced placeholder ${name} in template.",
        "Unreplaced placeholder ${age} in template.",
        "Unreplaced placeholder ${name} in template.",
        "Unreplaced placeholder ${sisterAge} in template.",
      ]);
    });

    test("reports unreplaced placeholders left in the result", () => {
      const result = render("Welcome ${name}, your role is ${role}.", {
        name: "Ana",
      });

      expect(result.value).toBe("Welcome Ana, your role is ${role}.");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Unreplaced placeholder ${role} in template.",
      );
    });

    test("reports valid when all placeholders are replaced", () => {
      const result = render("Hello, ${name}!", { name: "John" });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe("preserves input integrity", () => {
    test("does not mutate the original variables object", () => {
      const variables = { name: "John", age: "21" };
      render("Hello, ${name}! Age: ${age}", variables);

      expect(variables).toEqual({ name: "John", age: "21" });
    });

    test("replaces placeholder with empty string when value is empty", () => {
      const result = render("Hello, ${name}!", { name: "" });

      expect(result.value).toBe("Hello, !");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });
});

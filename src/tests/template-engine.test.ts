import { test, expect, describe } from "@jest/globals";
import { render } from "../core/template-engine";

describe("The template engine", () => {
  describe("preserves template when no interpolation applies", () => {
    test.each([
      ["without placeholders", "Hello, world!", {}, "Hello, world!", true],
      [
        "with placeholders but no variables",
        "Hello, ${name}!",
        {},
        "Hello, ${name}!",
        false,
      ],
      [
        "with variables that do not match any placeholder",
        "Hello, ${name}!",
        { age: "21" },
        "Hello, ${name}!",
        false,
      ],
      ["with empty template", "", {}, "", true],
      ["with empty template and unused variables", "", { name: "John" }, "", false],
    ])(
      "remains unchanged %s",
      (_, template, variables, expected, expectedIsValid) => {
        const result = render(template, variables);
        expect(result.value).toBe(expected);
        expect(result.isValid).toBe(expectedIsValid);
      },
    );
  });

  describe("interpolates variables into placeholders", () => {
    test.each([
      [
        "a single variable",
        "Hello, ${name}!",
        { name: "John" },
        "Hello, John!",
      ],
      [
        "all occurrences of a repeated placeholder",
        "Hello, ${name}! Welcome, ${name}!",
        { name: "John" },
        "Hello, John! Welcome, John!",
      ],
      [
        "multiple distinct variables",
        "Here it is ${name}!, he is ${age} years old.",
        { name: "John", age: "21" },
        "Here it is John!, he is 21 years old.",
      ],
      [
        "a complex template with repeated and distinct variables",
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
        { name: "John", age: "21", sisterAge: "25" },
        "Here it is John!, he is 21 years old and the sister of John is 25.",
      ],
    ])("resolves %s", (_, template, variables, expected) => {
      const result = render(template, variables);
      expect(result.value).toBe(expected);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe("partially interpolates when variables are incomplete", () => {
    test.each([
      [
        "available variables are interpolated, missing ones stay as placeholders",
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
        { name: "John", sisterAge: "25" },
        "Here it is John!, he is ${age} years old and the sister of John is 25.",
      ],
      [
        "null value prevents interpolation for that variable",
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
        { name: null, sisterAge: "25" },
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is 25.",
      ],
    ])("accepts %s", (_, template, variables, expected) => {
      const result = render(template, variables);
      expect(result.value).toBe(expected);
      expect(result.isValid).toBe(false);
    });
  });

  describe("reports errors for invalid or missing variables", () => {
    test("accumulates all errors from null values, unused keys, and unreplaced placeholders", () => {
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

    test("identifies unreplaced placeholders when variables are incomplete", () => {
      const result = render("Welcome ${name}, your role is ${role}.", {
        name: "Ana",
      });

      expect(result.value).toBe("Welcome Ana, your role is ${role}.");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Unreplaced placeholder ${role} in template.",
      );
    });

    test("considers the result valid when every placeholder is resolved", () => {
      const result = render("Hello, ${name}!", { name: "John" });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe("preserves input integrity", () => {
    test("leaves the original variables object unchanged", () => {
      const variables = { name: "John", age: "21" };
      render("Hello, ${name}! Age: ${age}", variables);

      expect(variables).toEqual({ name: "John", age: "21" });
    });

    test("accepts empty string as a valid variable value", () => {
      const result = render("Hello, ${name}!", { name: "" });

      expect(result.value).toBe("Hello, !");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });
});

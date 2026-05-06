import { test, expect, describe } from "@jest/globals";
import { render } from "../core/template-engine";

describe("The template engine", () => {
  describe("preserves template when no interpolation applies", () => {
    test.each([
      {
        scenario: "without placeholders",
        template: "Hello, world!",
        variables: {},
        expected: "Hello, world!",
        expectedIsValid: true,
      },
      {
        scenario: "with placeholders but no variables",
        template: "Hello, ${name}!",
        variables: {},
        expected: "Hello, ${name}!",
        expectedIsValid: false,
      },
      {
        scenario: "with variables that do not match any placeholder",
        template: "Hello, ${name}!",
        variables: { age: "21" },
        expected: "Hello, ${name}!",
        expectedIsValid: false,
      },
      {
        scenario: "with empty template",
        template: "",
        variables: {},
        expected: "",
        expectedIsValid: true,
      },
      {
        scenario: "with empty template and unused variables",
        template: "",
        variables: { name: "John" },
        expected: "",
        expectedIsValid: false,
      },
    ])(
      "remains unchanged $scenario",
      ({ template, variables, expected, expectedIsValid }) => {
        const result = render(template, variables);

        expect(result.value).toBe(expected);
        expect(result.isValid).toBe(expectedIsValid);
      },
    );
  });

  describe("interpolates variables into placeholders", () => {
    test.each([
      {
        scenario: "a single variable",
        template: "Hello, ${name}!",
        variables: { name: "John" },
        expected: "Hello, John!",
      },
      {
        scenario: "all occurrences of a repeated placeholder",
        template: "Hello, ${name}! Welcome, ${name}!",
        variables: { name: "John" },
        expected: "Hello, John! Welcome, John!",
      },
      {
        scenario: "multiple distinct variables",
        template: "Here it is ${name}!, he is ${age} years old.",
        variables: { name: "John", age: "21" },
        expected: "Here it is John!, he is 21 years old.",
      },
      {
        scenario: "a complex template with repeated and distinct variables",
        template:
          "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
        variables: { name: "John", age: "21", sisterAge: "25" },
        expected:
          "Here it is John!, he is 21 years old and the sister of John is 25.",
      },
    ])("resolves $scenario", ({ template, variables, expected }) => {
      const result = render(template, variables);

      expect(result.value).toBe(expected);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe("partially interpolates when variables are incomplete", () => {
    test.each([
      {
        scenario:
          "available variables are interpolated, missing ones stay as placeholders",
        template:
          "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
        variables: { name: "John", sisterAge: "25" },
        expected:
          "Here it is John!, he is ${age} years old and the sister of John is 25.",
      },
    ])("accepts $scenario", ({ template, variables, expected }) => {
      const result = render(template, variables);

      expect(result.value).toBe(expected);
      expect(result.isValid).toBe(false);
    });
  });

  describe("reports errors for invalid or missing variables", () => {
    test("accumulates all errors from unused keys and unreplaced placeholders", () => {
      const result = render(
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
        {
          bar: "25",
          baz: "30",
        },
      );

      expect(result.value).toBe(
        "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
      );
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual([
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

  describe("handles edge cases in placeholder syntax", () => {
    test("does not treat a value containing placeholder syntax as a new placeholder", () => {
      const result = render("Hello, ${name}!", { name: "${greeting}" });

      expect(result.value).toBe("Hello, ${greeting}!");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("ignores unclosed placeholder syntax", () => {
      const result = render("Price is ${amount", {});

      expect(result.value).toBe("Price is ${amount");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("ignores lone dollar sign", () => {
      const result = render("Price is $100", {});

      expect(result.value).toBe("Price is $100");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("ignores placeholder with non-word characters", () => {
      const result = render("Hello, ${my-var}!", {});

      expect(result.value).toBe("Hello, ${my-var}!");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });
});

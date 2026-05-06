import { test, expect, describe } from "@jest/globals";
import { render } from "../core/template-engine";

describe("The render function", () => {
  const stdoutSpy = jest
    .spyOn(process.stdout, "write")
    .mockImplementation(() => true);

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
        const parsedText = render(template, variables);
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
      const parsedText = render(template, variables);
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
      const parsedText = render(template, variables);
      expect(parsedText).toBe(expected);
    });
  });

  test("should log a message when no replacements are done", () => {
    const parsedText = render(
      "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
      {
        foo: null,
        bar: "25",
        baz: "30",
      },
    );
    const expected =
      "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.";

    expect(stdoutSpy).toHaveBeenCalledWith(
      "No replacements done! key ${foo} has no value.\n",
    );
    expect(stdoutSpy).toHaveBeenCalledWith(
      "No replacements done! key ${bar} not found in the template.\n",
    );
    expect(stdoutSpy).toHaveBeenCalledWith(
      "No replacements done! key ${baz} not found in the template.\n",
    );
    expect(parsedText).toBe(expected);
  });

  test("does not mutate the original variables object", () => {
    const variables = { name: "John", age: "21" };
    render("Hello, ${name}! Age: ${age}", variables);

    expect(variables).toEqual({ name: "John", age: "21" });
  });
});

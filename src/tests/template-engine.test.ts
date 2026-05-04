import { test, expect, describe } from "@jest/globals";
import { render } from "../core/template-engine";

describe("The render function", () => {
  test("should return the template unchanged if there are no placeholders", () => {
    const result = render("Hello, world!", {});
    const expected = "Hello, world!";

    expect(result).toBe(expected);
  });

  test("should return the same template if no variables are provided", () => {
    const result = render("Hello, ${name}!", {});
    const expected = "Hello, ${name}!";

    expect(result).toBe(expected);
  });

  test("should return the template as is when variables are provided but no placeholders match", () => {
    const result = render("Hello, ${name}!", { age: "21" });
    const expected = "Hello, ${name}!";

    expect(result).toBe(expected);
  });

  test("should replace the placeholder following the pattern ${variable_name}", () => {
    const result = render("Hello, ${name}!", { name: "John" });
    const expected = "Hello, John!";

    expect(result).toBe(expected);
  });

  test("should replace all occurrences of the placeholder following the pattern ${variable_name}", () => {
    const result = render("Hello, ${name}! Welcome, ${name}!", {
      name: "John",
    });
    const expected = "Hello, John! Welcome, John!";

    expect(result).toBe(expected);
  });

  test("should replace occurrences with multiple placeholders following the pattern ${variable_name}", () => {
    const result = render("Here it is ${name}!, he is ${age} years old.", {
      name: "John",
      age: "21",
    });
    const expected = "Here it is John!, he is 21 years old.";

    expect(result).toBe(expected);
  });

  test("should replace all occurrences with multiple placeholders following the pattern ${variable_name}", () => {
    const result = render(
      "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
      {
        name: "John",
        age: "21",
        sisterAge: "25",
      },
    );
    const expected =
      "Here it is John!, he is 21 years old and the sister of John is 25.";
    expect(result).toBe(expected);
  });
});

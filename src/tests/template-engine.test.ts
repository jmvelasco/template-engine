import { test, expect, describe } from "@jest/globals";
import { render } from "../core/template-engine";

describe("The render function", () => {
  const stdoutSpy = jest
    .spyOn(process.stdout, "write")
    .mockImplementation(() => true);

  test("should return the template unchanged if there are no placeholders", () => {
    const parsedText = render("Hello, world!", {});
    const expected = "Hello, world!";

    expect(parsedText).toBe(expected);
  });

  test("should return the same template if no variables are provided", () => {
    const parsedText = render("Hello, ${name}!", {});
    const expected = "Hello, ${name}!";

    expect(parsedText).toBe(expected);
  });

  test("should return the template as is when variables are provided but no placeholders match", () => {
    const parsedText = render("Hello, ${name}!", { age: "21" });
    const expected = "Hello, ${name}!";

    expect(parsedText).toBe(expected);
  });

  test("should replace the placeholder following the pattern ${variable_name}", () => {
    const parsedText = render("Hello, ${name}!", {
      name: "John",
    });
    const expected = "Hello, John!";

    expect(parsedText).toBe(expected);
  });

  test("should replace all occurrences of the placeholder following the pattern ${variable_name}", () => {
    const parsedText = render("Hello, ${name}! Welcome, ${name}!", {
      name: "John",
    });
    const expected = "Hello, John! Welcome, John!";

    expect(parsedText).toBe(expected);
  });

  test("should replace occurrences with multiple placeholders following the pattern ${variable_name}", () => {
    const parsedText = render("Here it is ${name}!, he is ${age} years old.", {
      name: "John",
      age: "21",
    });
    const expected = "Here it is John!, he is 21 years old.";

    expect(parsedText).toBe(expected);
  });

  test("should replace all occurrences with multiple placeholders following the pattern ${variable_name}", () => {
    const parsedText = render(
      "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
      {
        name: "John",
        age: "21",
        sisterAge: "25",
      },
    );
    const expected =
      "Here it is John!, he is 21 years old and the sister of John is 25.";

    expect(parsedText).toBe(expected);
  });

  test("should return empty when the template and dictionary are empty", () => {
    const parsedText = render("", {});
    const expected = "";

    expect(parsedText).toBe(expected);
  });

  test("should return empty when the template is an empty string", () => {
    const parsedText = render("", { name: "John" });
    const expected = "";

    expect(parsedText).toBe(expected);
  });

  test("should replace occurrences for matching placeholders following the pattern ${variable_name}, let as it is for no matching placeholder", () => {
    const parsedText = render(
      "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
      {
        name: "John",
        sisterAge: "25",
      },
    );
    const expected =
      "Here it is John!, he is ${age} years old and the sister of John is 25.";

    expect(parsedText).toBe(expected);
  });

  test("should replace occurrences for matching placeholders following the pattern ${variable_name}, let as it is for no null placeholder value in the dictionary", () => {
    const parsedText = render(
      "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.",
      {
        name: null,
        sisterAge: "25",
      },
    );
    const expected =
      "Here it is ${name}!, he is ${age} years old and the sister of ${name} is 25.";

    expect(parsedText).toBe(expected);
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
});

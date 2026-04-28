import { test, expect } from "@jest/globals";

function returnTemplate(
  templateString: string,
  variables: Record<string, string>,
): string {
  const key = Object.keys(variables).at(0);
  const value = Object.values(variables).at(0);
  if (!key || !value) {
    return templateString;
  }
  return templateString.replace(`{${key}}`, value);
}

test("should return the same template if no variables are provided", () => {
  const result = returnTemplate("Hello, {name}!", {});
  const expected = "Hello, {name}!";

  expect(result).toBe(expected);
});

test("should replace the single variable with the provided value", () => {
  const result = returnTemplate("Hello, {name}!", { name: "John" });
  const expected = "Hello, John!";

  expect(result).toBe(expected);
});

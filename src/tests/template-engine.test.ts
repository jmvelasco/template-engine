import { test, expect } from "@jest/globals";

function returnTemplate(templateString: string): string {
  return templateString;
}

test("should return the same template if no variables are provided", () => {
  const result = returnTemplate("Hello, {name}!");
  const expected = "Hello, {name}!";

  expect(result).toBe(expected);
});

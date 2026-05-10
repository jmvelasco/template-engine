import { test, expect, describe } from "@jest/globals";
import { Template } from "../../Template";

describe("The Template", () => {
  test("renders an empty template with no variables successfully", () => {
    // Arrange
    const templateContent = "";
    const variables = {};

    // Act
    const template = Template.create(templateContent);
    const result = template.render(variables);

    // Assert
    expect(result.renderedText).toBe("");
    expect(result.status).toBe("SUCCESS");
    expect(result.notifications).toEqual([]);
  });
});

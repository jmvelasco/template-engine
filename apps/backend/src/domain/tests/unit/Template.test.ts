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

  test("replaces a single placeholder with its matching variable successfully", () => {
    // Arrange
    const templateContent = "Hello, ${name}!";
    const variables = { name: "John" };

    // Act
    const template = Template.create(templateContent);
    const result = template.render(variables);

    // Assert
    expect(result.renderedText).toBe("Hello, John!");
    expect(result.status).toBe("SUCCESS");
    expect(result.notifications).toEqual([]);
  });

  test("replaces multiple identical placeholders with matching variable successfully", () => {
    // Arrange
    const templateContent = "${name} and ${name}";
    const variables = { name: "Ada" };

    // Act
    const template = Template.create(templateContent);
    const result = template.render(variables);

    // Assert
    expect(result.renderedText).toBe("Ada and Ada");
    expect(result.status).toBe("SUCCESS");
    expect(result.notifications).toEqual([]);
  });

  test("generates a warning when a placeholder variable is null", () => {
    // Arrange
    const templateContent = "Hello, ${name}!";
    const variables = { name: null };

    // Act
    const template = Template.create(templateContent);
    const result = template.render(variables);

    // Assert
    expect(result.renderedText).toBe("Hello, ${name}!");
    expect(result.status).toBe("FAILED");
    expect(result.notifications).toEqual([
      {
        type: "WARNING",
        message: "Variable 'name' has a null value.",
        code: "NULL_VARIABLE_VALUE",
        details: { key: "name" },
      },
    ]);
  });

  test("generates a warning when a placeholder variable is missing in the dictionary", () => {
    // Arrange
    const templateContent = "Hello, ${name}!";
    const variables = {};

    // Act
    const template = Template.create(templateContent);
    const result = template.render(variables);

    // Assert
    expect(result.renderedText).toBe("Hello, ${name}!");
    expect(result.status).toBe("FAILED");
    expect(result.notifications).toEqual([
      {
        type: "WARNING",
        message: "Variable 'name' is required but was not provided in the dictionary.",
        code: "MISSING_VARIABLE",
        details: { key: "name" },
      },
    ]);
  });
});

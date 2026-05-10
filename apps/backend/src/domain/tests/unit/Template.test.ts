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
        message:
          "Variable 'name' is required but was not provided in the dictionary.",
        code: "MISSING_VARIABLE",
        details: { key: "name" },
      },
    ]);
  });

  test("returns partial status when some placeholders are resolved and others are missing", () => {
    // Arrange
    const templateContent = "Hello ${name}, your age is ${age}";
    const variables = { name: "Ada" };

    // Act
    const template = Template.create(templateContent);
    const result = template.render(variables);

    // Assert
    expect(result.renderedText).toBe("Hello Ada, your age is ${age}");
    expect(result.status).toBe("PARTIAL");
    expect(result.notifications).toEqual([
      {
        type: "WARNING",
        message:
          "Variable 'age' is required but was not provided in the dictionary.",
        code: "MISSING_VARIABLE",
        details: { key: "age" },
      },
    ]);
  });

  test("generates a warning when a dictionary variable is unused in the template", () => {
    // Arrange
    const templateContent = "Hello world!";
    const variables = { unusedKey: "value" };

    // Act
    const template = Template.create(templateContent);
    const result = template.render(variables);

    // Assert
    expect(result.renderedText).toBe("Hello world!");
    expect(result.status).toBe("SUCCESS");
    expect(result.notifications).toEqual([
      {
        type: "WARNING",
        message:
          "Variable 'unusedKey' is defined in the dictionary but was not used in the template.",
        code: "UNUSED_VARIABLE",
        details: { key: "unusedKey" },
      },
    ]);
  });
});

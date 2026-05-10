"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Template_1 = require("../../Template");
(0, globals_1.describe)("The Template", () => {
    (0, globals_1.test)("renders an empty template with no variables successfully", () => {
        // Arrange
        const templateContent = "";
        const variables = {};
        // Act
        const template = Template_1.Template.create(templateContent);
        const result = template.render(variables);
        // Assert
        (0, globals_1.expect)(result.renderedText).toBe("");
        (0, globals_1.expect)(result.status).toBe("SUCCESS");
        (0, globals_1.expect)(result.notifications).toEqual([]);
    });
    (0, globals_1.test)("replaces a single placeholder with its matching variable successfully", () => {
        // Arrange
        const templateContent = "Hello, ${name}!";
        const variables = { name: "John" };
        // Act
        const template = Template_1.Template.create(templateContent);
        const result = template.render(variables);
        // Assert
        (0, globals_1.expect)(result.renderedText).toBe("Hello, John!");
        (0, globals_1.expect)(result.status).toBe("SUCCESS");
        (0, globals_1.expect)(result.notifications).toEqual([]);
    });
    (0, globals_1.test)("replaces multiple identical placeholders with matching variable successfully", () => {
        // Arrange
        const templateContent = "${name} and ${name}";
        const variables = { name: "Ada" };
        // Act
        const template = Template_1.Template.create(templateContent);
        const result = template.render(variables);
        // Assert
        (0, globals_1.expect)(result.renderedText).toBe("Ada and Ada");
        (0, globals_1.expect)(result.status).toBe("SUCCESS");
        (0, globals_1.expect)(result.notifications).toEqual([]);
    });
    (0, globals_1.test)("generates a warning when a placeholder variable is null", () => {
        // Arrange
        const templateContent = "Hello, ${name}!";
        const variables = { name: null };
        // Act
        const template = Template_1.Template.create(templateContent);
        const result = template.render(variables);
        // Assert
        (0, globals_1.expect)(result.renderedText).toBe("Hello, ${name}!");
        (0, globals_1.expect)(result.status).toBe("FAILED");
        (0, globals_1.expect)(result.notifications).toEqual([
            {
                type: "WARNING",
                message: "Variable 'name' has a null value.",
                code: "NULL_VARIABLE_VALUE",
                details: { key: "name" },
            },
        ]);
    });
    (0, globals_1.test)("generates a warning when a placeholder variable is missing in the dictionary", () => {
        // Arrange
        const templateContent = "Hello, ${name}!";
        const variables = {};
        // Act
        const template = Template_1.Template.create(templateContent);
        const result = template.render(variables);
        // Assert
        (0, globals_1.expect)(result.renderedText).toBe("Hello, ${name}!");
        (0, globals_1.expect)(result.status).toBe("FAILED");
        (0, globals_1.expect)(result.notifications).toEqual([
            {
                type: "WARNING",
                message: "Variable 'name' is required but was not provided in the dictionary.",
                code: "MISSING_VARIABLE",
                details: { key: "name" },
            },
        ]);
    });
    (0, globals_1.test)("returns partial status when some placeholders are resolved and others are missing", () => {
        // Arrange
        const templateContent = "Hello ${name}, your age is ${age}";
        const variables = { name: "Ada" };
        // Act
        const template = Template_1.Template.create(templateContent);
        const result = template.render(variables);
        // Assert
        (0, globals_1.expect)(result.renderedText).toBe("Hello Ada, your age is ${age}");
        (0, globals_1.expect)(result.status).toBe("PARTIAL");
        (0, globals_1.expect)(result.notifications).toEqual([
            {
                type: "WARNING",
                message: "Variable 'age' is required but was not provided in the dictionary.",
                code: "MISSING_VARIABLE",
                details: { key: "age" },
            },
        ]);
    });
    (0, globals_1.test)("generates a warning when a dictionary variable is unused in the template", () => {
        // Arrange
        const templateContent = "Hello world!";
        const variables = { unusedKey: "value" };
        // Act
        const template = Template_1.Template.create(templateContent);
        const result = template.render(variables);
        // Assert
        (0, globals_1.expect)(result.renderedText).toBe("Hello world!");
        (0, globals_1.expect)(result.status).toBe("SUCCESS");
        (0, globals_1.expect)(result.notifications).toEqual([
            {
                type: "WARNING",
                message: "Variable 'unusedKey' is defined in the dictionary but was not used in the template.",
                code: "UNUSED_VARIABLE",
                details: { key: "unusedKey" },
            },
        ]);
    });
});
//# sourceMappingURL=Template.test.js.map
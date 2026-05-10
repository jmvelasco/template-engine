"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const template_engine_1 = require("../core/template-engine");
(0, globals_1.describe)("The render function", () => {
    const loggerSpy = jest
        .spyOn(process.stdout, "write")
        .mockImplementation(() => true);
    (0, globals_1.describe)("returns template unchanged when there are no replacements", () => {
        globals_1.test.each([
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
        ])("should return the same template if %s", (_, template, variables, expected) => {
            const parsedText = (0, template_engine_1.render)(template, variables);
            (0, globals_1.expect)(parsedText).toBe(expected);
        });
    });
    (0, globals_1.describe)("replaces placeholders successfully", () => {
        globals_1.test.each([
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
            const parsedText = (0, template_engine_1.render)(template, variables);
            (0, globals_1.expect)(parsedText).toBe(expected);
        });
    });
    (0, globals_1.describe)("handles partial replacements correctly", () => {
        globals_1.test.each([
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
            const parsedText = (0, template_engine_1.render)(template, variables);
            (0, globals_1.expect)(parsedText).toBe(expected);
        });
    });
    (0, globals_1.test)("should log a message when no replacements are done", () => {
        const parsedText = (0, template_engine_1.render)("Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.", {
            foo: null,
            bar: "25",
            baz: "30",
        });
        const expected = "Here it is ${name}!, he is ${age} years old and the sister of ${name} is ${sisterAge}.";
        (0, globals_1.expect)(loggerSpy).toHaveBeenCalledWith("No replacements done! key ${foo} has no value.\n");
        (0, globals_1.expect)(loggerSpy).toHaveBeenCalledWith("No replacements done! key ${bar} not found in the template.\n");
        (0, globals_1.expect)(loggerSpy).toHaveBeenCalledWith("No replacements done! key ${baz} not found in the template.\n");
        (0, globals_1.expect)(parsedText).toBe(expected);
    });
});
//# sourceMappingURL=template-engine.test.js.map
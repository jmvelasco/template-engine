"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParseTemplateUseCase_1 = require("../../ParseTemplateUseCase");
describe("The Parse Template UseCase", () => {
    test("orchestrates the parsing of a template with the given dictionary", () => {
        // Arrange
        const useCase = new ParseTemplateUseCase_1.ParseTemplateUseCase();
        const command = {
            templateContent: "Hello, ${name}!",
            variables: { name: "Ada" },
        };
        // Act
        const result = useCase.execute(command);
        // Assert
        expect(result.renderedText).toBe("Hello, Ada!");
        expect(result.status).toBe("SUCCESS");
        expect(result.notifications).toEqual([]);
    });
});
//# sourceMappingURL=ParseTemplateUseCase.test.js.map
import { ParseTemplateUseCase } from "../../ParseTemplateUseCase";

describe("The Parse Template UseCase", () => {
  test("orchestrates the parsing of a template with the given dictionary", () => {
    // Arrange
    const useCase = new ParseTemplateUseCase();
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

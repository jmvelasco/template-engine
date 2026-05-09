import { ParseTemplateUseCase } from "../../application/parse-template-use-case";
import { TemplateEngine } from "../../domain/template-engine";

describe("ParseTemplateUseCase", () => {
  test("delegates to TemplateEngine and returns ParseResult", () => {
    const engine = new TemplateEngine();
    const useCase = new ParseTemplateUseCase(engine);

    const result = useCase.execute("Hello, ${name}!", { name: "World" });

    expect(result).toEqual({
      text: "Hello, World!",
      notifications: [
        { type: "replaced", key: "name", value: "World", occurrences: 1 },
      ],
    });
  });
});

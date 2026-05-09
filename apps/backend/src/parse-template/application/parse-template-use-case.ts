import { TemplateEngine, ParseResult } from "../domain/template-engine";

class ParseTemplateUseCase {
  constructor(private readonly templateEngine: TemplateEngine) {}

  execute(
    template: string,
    variables: Record<string, string | null>,
  ): ParseResult {
    return this.templateEngine.parse(template, variables);
  }
}

export { ParseTemplateUseCase };

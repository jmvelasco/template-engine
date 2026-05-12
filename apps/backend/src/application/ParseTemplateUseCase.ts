import { ParseResult } from "../domain/ParseResult";
import { TemplateEngine } from "../domain/TemplateEngine";

export class ParseTemplateUseCase {
  execute(
    template: string,
    variables: Record<string, string | null>,
  ): ParseResult {
    return TemplateEngine.parse(template, variables);
  }
}

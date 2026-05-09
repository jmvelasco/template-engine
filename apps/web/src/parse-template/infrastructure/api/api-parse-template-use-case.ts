import { parseTemplateApi } from "../api/parse-template-api";
import { ParseResult } from "../../domain/parse-result";
import { ParseTemplateUseCase } from "../../domain/parse-template-use-case";

class ApiParseTemplateUseCase implements ParseTemplateUseCase {
  async execute(
    template: string,
    variables: Record<string, string | null>,
  ): Promise<ParseResult> {
    return parseTemplateApi(template, variables);
  }
}

export { ApiParseTemplateUseCase };

import { ParseResult } from "../domain/ParseResult";

export class ParseTemplateUseCase {
  execute(
    _template: string,
    _variables: Record<string, string | null>,
  ): ParseResult {
    return undefined as unknown as ParseResult;
  }
}

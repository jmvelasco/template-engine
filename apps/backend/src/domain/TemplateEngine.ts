import { ParseResult } from "./ParseResult";

export class TemplateEngine {
  static parse(
    _template: string,
    _variables: Record<string, string | null>,
  ): ParseResult {
    return undefined as unknown as ParseResult;
  }
}

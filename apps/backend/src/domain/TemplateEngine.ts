import { ParseResult } from "./ParseResult";
import { Notification } from "./Notification";

export class TemplateEngine {
  static parse(
    template: string,
    _variables: Record<string, string | null>,
  ): ParseResult {
    return ParseResult.create(template, [
      Notification.info("Template is empty, nothing to process"),
    ]);
  }
}

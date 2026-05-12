import { parse } from "../../domain/template-engine";
import { ParseNotifier } from "../../domain/ports/parse-notifier";

export interface ParseTemplateRequest {
  template: string;
  variables: Record<string, string | null>;
}

export class ParseTemplateUseCase {
  public execute(
    request: ParseTemplateRequest,
    notifier?: ParseNotifier,
  ): string {
    return parse(request.template, request.variables, notifier);
  }
}

import type { ParseResponse } from "@template-engine/api-types";

export interface TemplateEngine {
  parse(
    template: string,
    variables: Record<string, string | null>,
  ): Promise<ParseResponse>;
}

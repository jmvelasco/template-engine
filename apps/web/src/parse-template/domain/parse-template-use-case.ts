import type { ParseResult } from "./parse-result";

interface ParseTemplateUseCase {
  execute(
    template: string,
    variables: Record<string, string | null>,
  ): Promise<ParseResult>;
}

export type { ParseTemplateUseCase };

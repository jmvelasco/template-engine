import type { ParseResponse } from "@template-engine/api-types";
import type { TemplateEnginePort } from "../domain/TemplateEnginePort";

export class HttpTemplateEngine implements TemplateEnginePort {
  constructor(private readonly baseUrl: string) {}

  async parse(
    template: string,
    variables: Record<string, string | null>,
  ): Promise<ParseResponse> {
    const response = await fetch(`${this.baseUrl}/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, variables }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Parse request failed");
    }

    return response.json();
  }
}

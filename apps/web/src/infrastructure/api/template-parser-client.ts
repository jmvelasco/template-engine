export interface ParseEvent {
  type: "SUCCESS" | "WARNING";
  message: string;
}

export interface ParseResponse {
  parsedText: string;
  events: ParseEvent[];
}

export class TemplateParserClient {
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(
    baseUrl = "http://localhost:3001",
    fetchFn: typeof fetch = (...args) => fetch(...args),
  ) {
    this.baseUrl = baseUrl;
    this.fetchFn = fetchFn;
  }

  public async parse(
    template: string,
    variables: Record<string, string | null>,
  ): Promise<ParseResponse> {
    try {
      const response = await this.fetchFn(`${this.baseUrl}/api/parse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ template, variables }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unknown server error occurred.");
      }

      return data as ParseResponse;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        !error.message.startsWith("Failed to parse template:")
      ) {
        throw new Error(`Failed to parse template: ${error.message}`);
      }
      throw error;
    }
  }
}

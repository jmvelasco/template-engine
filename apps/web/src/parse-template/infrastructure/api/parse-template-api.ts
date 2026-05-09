import { ParseResult } from "../domain/parse-result";

const API_BASE_URL = "http://localhost:3000";

async function parseTemplateApi(
  template: string,
  variables: Record<string, string | null>,
): Promise<ParseResult> {
  const response = await fetch(`${API_BASE_URL}/api/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template, variables }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "Parse request failed");
  }

  return response.json();
}

export { parseTemplateApi };

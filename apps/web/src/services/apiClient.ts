import type { ParsingResult } from "../types/api";

const API_BASE_URL = "http://localhost:3001";

interface ApiErrorResponse {
  error?: string;
}

export async function parseTemplate(
  templateContent: string,
  variables: Record<string, string | null>,
): Promise<ParsingResult> {
  const response = await fetch(`${API_BASE_URL}/api/parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ templateContent, variables }),
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => ({}))) as ApiErrorResponse;
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json() as Promise<ParsingResult>;
}

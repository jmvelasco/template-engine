import { test, expect, describe } from "vitest";
import { HttpTemplateParserAdapter } from "../infrastructure/adapters/http-template-parser.adapter";

describe("The HttpTemplateParserAdapter", () => {
  test("sends a POST request to /api/parse with template and variables", async () => {
    let calledUrl = "";
    let calledOptions: RequestInit = {};

    const fakeFetch = async (
      url: string | URL | Request,
      options?: RequestInit,
    ) => {
      calledUrl = url.toString();
      calledOptions = options || {};
      return {
        ok: true,
        json: async () => ({
          parsedText: "Hello Ada!",
          events: [{ type: "SUCCESS", message: "Replaced ${name} with 'Ada'" }],
        }),
      } as unknown as Response;
    };

    const adapter = new HttpTemplateParserAdapter(
      "http://localhost:3001",
      fakeFetch as unknown as typeof fetch,
    );
    const result = await adapter.parse("Hello, ${name}!", { name: "Ada" });

    expect(calledUrl).toBe("http://localhost:3001/api/parse");
    expect(calledOptions.method).toBe("POST");
    expect(calledOptions.headers).toEqual({
      "Content-Type": "application/json",
    });
    expect(JSON.parse(calledOptions.body as string)).toEqual({
      template: "Hello, ${name}!",
      variables: { name: "Ada" },
    });
    expect(result).toEqual({
      parsedText: "Hello Ada!",
      events: [{ type: "SUCCESS", message: "Replaced ${name} with 'Ada'" }],
    });
  });

  test("throws an error when the server returns an error response", async () => {
    const fakeFetch = async () => {
      return {
        ok: false,
        json: async () => ({ error: "Some server error message." }),
      } as unknown as Response;
    };

    const adapter = new HttpTemplateParserAdapter(
      "http://localhost:3001",
      fakeFetch as unknown as typeof fetch,
    );

    await expect(
      adapter.parse("Hello, ${name}!", { name: null }),
    ).rejects.toThrow("Some server error message.");
  });

  test("throws a generic error when the request fails due to a network error", async () => {
    const fakeFetch = async () => {
      throw new Error("Network connection failure.");
    };

    const adapter = new HttpTemplateParserAdapter(
      "http://localhost:3001",
      fakeFetch as unknown as typeof fetch,
    );

    await expect(
      adapter.parse("Hello, ${name}!", { name: "Ada" }),
    ).rejects.toThrow("Failed to parse template: Network connection failure.");
  });
});

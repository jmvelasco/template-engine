import { test, expect, describe } from "vitest";
import {
  TemplateParserClient,
  ParseResponse,
} from "../infrastructure/api/template-parser-client";

describe("The TemplateParserClient", () => {
  test("sends a POST request to /api/parse with template and variables", async () => {
    let calledUrl = "";
    let calledOptions: any = {};

    const fakeFetch = async (url: string, options: any) => {
      calledUrl = url;
      calledOptions = options;
      return {
        ok: true,
        json: async () => ({
          parsedText: "Hello Ada!",
          events: [{ type: "SUCCESS", message: "Replaced ${name} with 'Ada'" }],
        }),
      } as any;
    };

    const client = new TemplateParserClient("http://localhost:3001", fakeFetch);
    const result = await client.parse("Hello, ${name}!", { name: "Ada" });

    expect(calledUrl).toBe("http://localhost:3001/api/parse");
    expect(calledOptions.method).toBe("POST");
    expect(calledOptions.headers).toEqual({
      "Content-Type": "application/json",
    });
    expect(JSON.parse(calledOptions.body)).toEqual({
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
      } as any;
    };

    const client = new TemplateParserClient("http://localhost:3001", fakeFetch);

    await expect(
      client.parse("Hello, ${name}!", { name: null }),
    ).rejects.toThrow("Some server error message.");
  });

  test("throws a generic error when the request fails due to a network error", async () => {
    const fakeFetch = async () => {
      throw new Error("Network connection failure.");
    };

    const client = new TemplateParserClient("http://localhost:3001", fakeFetch);

    await expect(
      client.parse("Hello, ${name}!", { name: "Ada" }),
    ).rejects.toThrow("Failed to parse template: Network connection failure.");
  });
});

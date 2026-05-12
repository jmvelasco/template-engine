import { test, expect, describe } from "@jest/globals";
import request from "supertest";
import { app } from "../infrastructure/entrypoints/api/app";

describe("POST /api/parse", () => {
  test("parses a template successfully with variables", async () => {
    const response = await request(app)
      .post("/api/parse")
      .send({
        template: "Hello, ${name}!",
        variables: { name: "Ada" },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      parsedText: "Hello, Ada!",
      events: [
        {
          type: "SUCCESS",
          message: "Replaced ${name} with 'Ada'",
        },
      ],
    });
  });

  test("returns 400 Bad Request when template is missing", async () => {
    const response = await request(app)
      .post("/api/parse")
      .send({
        variables: { name: "Ada" },
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing required parameter 'template'.",
    });
  });

  test("returns 400 Bad Request when template is not a string", async () => {
    const response = await request(app)
      .post("/api/parse")
      .send({
        template: 12345,
        variables: { name: "Ada" },
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Parameter 'template' must be a string.",
    });
  });

  test("returns 400 Bad Request when variables is missing", async () => {
    const response = await request(app)
      .post("/api/parse")
      .send({
        template: "Hello, ${name}!",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing required parameter 'variables'.",
    });
  });

  test("returns 400 Bad Request when variables is not an object", async () => {
    const response = await request(app)
      .post("/api/parse")
      .send({
        template: "Hello, ${name}!",
        variables: "invalid",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Parameter 'variables' must be an object.",
    });
  });
});

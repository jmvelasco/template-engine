import request from "supertest";
import { Express } from "express";
import { ParseTemplateUseCase } from "../../../../application/ParseTemplateUseCase";
import { createServer } from "../../createServer";

describe("The HTTP Parse Server API", () => {
  let app: Express;

  beforeAll(() => {
    const useCase = new ParseTemplateUseCase();
    app = createServer(useCase);
  });

  test("accepts a POST /api/parse and returns the parsing result", async () => {
    // Arrange
    const payload = {
      templateContent: "Hello, ${name}!",
      variables: { name: "Ada" },
    };

    // Act
    const response = await request(app).post("/api/parse").send(payload);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      renderedText: "Hello, Ada!",
      status: "SUCCESS",
      notifications: [],
    });
  });

  test("returns 400 Bad Request when templateContent is missing", async () => {
    // Arrange
    const payload = {
      variables: { name: "Ada" },
    };

    // Act
    const response = await request(app).post("/api/parse").send(payload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("templateContent must be a string");
  });

  test("returns 400 Bad Request when variables is missing", async () => {
    // Arrange
    const payload = {
      templateContent: "Hello, ${name}!",
    };

    // Act
    const response = await request(app).post("/api/parse").send(payload);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("variables must be an object");
  });
});

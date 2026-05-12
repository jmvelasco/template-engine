import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import express from "express";
import { ParseTemplateController } from "../../infrastructure/ParseTemplateController";
import { ParseTemplateUseCase } from "../../application/ParseTemplateUseCase";

function createApp() {
  const useCase = new ParseTemplateUseCase();
  const controller = new ParseTemplateController(useCase);
  const app = express();
  app.use(express.json());
  app.post("/parse", controller.handle);
  return app;
}

describe("The ParseTemplateController", () => {
  test("returns parsed result for valid request", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/parse")
      .send({ template: "Hello, ${name}!", variables: { name: "Alice" } });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      text: "Hello, Alice!",
      status: "success",
      notifications: [
        { type: "success", message: "Replaced placeholder: name" },
      ],
    });
  });

  test("returns 400 when template is missing", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/parse")
      .send({ variables: { name: "Alice" } });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing required field: template",
    });
  });

  test("returns 400 when variables is missing", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/parse")
      .send({ template: "Hello!" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing required field: variables",
    });
  });
});

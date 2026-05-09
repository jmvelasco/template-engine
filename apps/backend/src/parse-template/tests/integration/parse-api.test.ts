import request from "supertest";
import { createApp } from "../../infrastructure/app";

describe("POST /api/parse", () => {
  const app = createApp();

  test("returns 200 and ParseResult for valid request", async () => {
    const response = await request(app)
      .post("/api/parse")
      .send({ template: "Hello, ${name}!", variables: { name: "Ada" } });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      text: "Hello, Ada!",
      notifications: [
        { type: "replaced", key: "name", value: "Ada", occurrences: 1 },
      ],
    });
  });

  test("returns 400 when template field is missing", async () => {
    const response = await request(app)
      .post("/api/parse")
      .send({ variables: {} });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "template field is required",
    });
  });

  test("returns 400 when variables field is missing", async () => {
    const response = await request(app)
      .post("/api/parse")
      .send({ template: "Hello!" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "variables field is required",
    });
  });

  test("returns 400 for invalid JSON body", async () => {
    const response = await request(app)
      .post("/api/parse")
      .set("Content-Type", "application/json")
      .send("not json");

    expect(response.status).toBe(400);
  });

  test("includes CORS headers in response", async () => {
    const response = await request(app)
      .options("/api/parse")
      .set("Origin", "http://localhost:5173");

    expect(response.headers["access-control-allow-origin"]).toBeDefined();
  });
});

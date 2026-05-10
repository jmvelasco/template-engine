"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const ParseTemplateUseCase_1 = require("../../../../application/ParseTemplateUseCase");
const createServer_1 = require("../../createServer");
describe("The HTTP Parse Server API", () => {
    let app;
    beforeAll(() => {
        const useCase = new ParseTemplateUseCase_1.ParseTemplateUseCase();
        app = (0, createServer_1.createServer)(useCase);
    });
    test("accepts a POST /api/parse and returns the parsing result", async () => {
        // Arrange
        const payload = {
            templateContent: "Hello, ${name}!",
            variables: { name: "Ada" },
        };
        // Act
        const response = await (0, supertest_1.default)(app).post("/api/parse").send(payload);
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
        const response = await (0, supertest_1.default)(app).post("/api/parse").send(payload);
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
        const response = await (0, supertest_1.default)(app).post("/api/parse").send(payload);
        // Assert
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("variables must be an object");
    });
});
//# sourceMappingURL=Server.test.js.map
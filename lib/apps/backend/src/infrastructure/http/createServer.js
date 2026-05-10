"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
function createServer(parseTemplateUseCase) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Simple CORS middleware
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        if (req.method === "OPTIONS") {
            res.sendStatus(200);
            return;
        }
        next();
    });
    app.post("/api/parse", (req, res) => {
        const { templateContent, variables } = req.body;
        if (typeof templateContent !== "string") {
            res.status(400).json({ error: "templateContent must be a string" });
            return;
        }
        if (!variables ||
            typeof variables !== "object" ||
            Array.isArray(variables)) {
            res.status(400).json({ error: "variables must be an object" });
            return;
        }
        const result = parseTemplateUseCase.execute({
            templateContent,
            variables,
        });
        res.json(result);
    });
    return app;
}
//# sourceMappingURL=createServer.js.map
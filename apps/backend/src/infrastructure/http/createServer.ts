import express, { Express, Request, Response } from "express";
import { ParseTemplateUseCase } from "../../application/ParseTemplateUseCase";

export function createServer(
  parseTemplateUseCase: ParseTemplateUseCase,
): Express {
  const app = express();

  app.use(express.json());

  // Simple CORS middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.post("/api/parse", (req: Request, res: Response): void => {
    const { templateContent, variables } = req.body;

    if (typeof templateContent !== "string") {
      res.status(400).json({ error: "templateContent must be a string" });
      return;
    }

    if (
      !variables ||
      typeof variables !== "object" ||
      Array.isArray(variables)
    ) {
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

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { TemplateEngine } from "../domain/template-engine";
import { ParseTemplateUseCase } from "../application/parse-template-use-case";

function createApp(): express.Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const templateEngine = new TemplateEngine();
  const parseTemplateUseCase = new ParseTemplateUseCase(templateEngine);

  app.post("/api/parse", (req: Request, res: Response) => {
    const { template, variables } = req.body;

    if (template === undefined) {
      res.status(400).json({ error: "template field is required" });
      return;
    }

    if (variables === undefined) {
      res.status(400).json({ error: "variables field is required" });
      return;
    }

    const result = parseTemplateUseCase.execute(template, variables);
    res.json(result);
  });

  app.use(
    (
      err: SyntaxError & { status?: number },
      _req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      if (err.status === 400) {
        res.status(400).json({ error: "Invalid JSON" });
        return;
      }
      _next(err);
    },
  );

  return app;
}

export { createApp };

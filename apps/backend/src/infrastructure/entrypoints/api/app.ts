import express, { Request, Response } from "express";
import cors from "cors";
import { ParseTemplateUseCase } from "../../../application/use-cases/parse-template.use-case";
import { InMemoryParseNotifier } from "../../adapters/in-memory-parse-notifier";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/parse", (req: Request, res: Response): void => {
  const { template, variables } = req.body;

  if (template === undefined) {
    res.status(400).json({ error: "Missing required parameter 'template'." });
    return;
  }

  if (typeof template !== "string") {
    res.status(400).json({ error: "Parameter 'template' must be a string." });
    return;
  }

  if (variables === undefined) {
    res.status(400).json({ error: "Missing required parameter 'variables'." });
    return;
  }

  if (
    typeof variables !== "object" ||
    variables === null ||
    Array.isArray(variables)
  ) {
    res.status(400).json({ error: "Parameter 'variables' must be an object." });
    return;
  }

  const useCase = new ParseTemplateUseCase();
  const notifier = new InMemoryParseNotifier();

  const parsedText = useCase.execute({ template, variables }, notifier);

  res.status(200).json({
    parsedText,
    events: notifier.getEvents(),
  });
});

export { app };

import type { Request, Response } from "express";
import type { ParseTemplateUseCase } from "../application/ParseTemplateUseCase";

export class ParseTemplateController {
  constructor(private readonly useCase: ParseTemplateUseCase) {}

  handle = (req: Request, res: Response): void => {
    const { template, variables } = req.body;

    if (template === undefined || template === null) {
      res.status(400).json({ error: "Missing required field: template" });
      return;
    }

    if (variables === undefined || variables === null) {
      res.status(400).json({ error: "Missing required field: variables" });
      return;
    }

    const result = this.useCase.execute(template, variables);

    res.status(200).json({
      text: result.text,
      status: result.status(),
      notifications: result.notifications,
    });
  };
}

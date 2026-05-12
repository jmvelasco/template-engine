import type { Request, Response } from "express";
import type { ParseTemplateUseCase } from "../application/ParseTemplateUseCase";

export class ParseTemplateController {
  constructor(private readonly useCase: ParseTemplateUseCase) {}

  handle = (_req: Request, _res: Response): void => {
    _res.status(500).json({ error: "Not implemented" });
  };
}

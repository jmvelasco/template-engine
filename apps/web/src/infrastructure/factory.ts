import { HttpTemplateEngine } from "./HttpTemplateEngine";
import type { TemplateEnginePort } from "../domain/TemplateEnginePort";

export function createTemplateEngine(): TemplateEnginePort {
  return new HttpTemplateEngine("");
}

import { HttpTemplateEngine } from "./HttpTemplateEngine";
import type { TemplateEngine } from "../domain/TemplateEngine";

export function createTemplateEngine(): TemplateEngine {
  return new HttpTemplateEngine("");
}

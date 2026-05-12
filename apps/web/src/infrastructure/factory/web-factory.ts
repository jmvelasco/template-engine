import { ParseTemplateUseCase } from "../../application/use-cases/parse-template.use-case";
import { HttpTemplateParserAdapter } from "../adapters/http-template-parser.adapter";

export class WebFactory {
  private static parseTemplateUseCaseInstance: ParseTemplateUseCase | null = null;

  public static createParseTemplateUseCase(
    baseUrl?: string,
    fetchFn?: typeof fetch,
  ): ParseTemplateUseCase {
    if (!this.parseTemplateUseCaseInstance || baseUrl || fetchFn) {
      const adapter = new HttpTemplateParserAdapter(baseUrl, fetchFn);
      const useCase = new ParseTemplateUseCase(adapter);

      // Cache singleton instance only when no custom parameters are passed
      if (!baseUrl && !fetchFn) {
        this.parseTemplateUseCaseInstance = useCase;
      }
      return useCase;
    }
    return this.parseTemplateUseCaseInstance;
  }
}

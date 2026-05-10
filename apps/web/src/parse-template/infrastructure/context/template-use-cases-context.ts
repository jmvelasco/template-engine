import { createContext, useContext } from "react";
import type { ParseTemplateUseCase } from "../../domain/parse-template-use-case";

interface TemplateUseCases {
  parseTemplate: ParseTemplateUseCase;
}

const TemplateUseCasesContext = createContext<TemplateUseCases | null>(null);

function useTemplateUseCases(): TemplateUseCases {
  const context = useContext(TemplateUseCasesContext);
  if (context === null) {
    throw new Error(
      "useTemplateUseCases must be used within TemplateUseCasesContext.Provider",
    );
  }
  return context;
}

export { TemplateUseCasesContext, useTemplateUseCases };
export type { TemplateUseCases };

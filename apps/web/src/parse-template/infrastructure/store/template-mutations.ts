import { useMutation } from "@tanstack/react-query";
import { useTemplateUseCases } from "../context/template-use-cases-context";

interface ParseTemplateMutationParams {
  template: string;
  variables: Record<string, string | null>;
}

function useParseTemplateMutation() {
  const useCases = useTemplateUseCases();

  return useMutation({
    mutationFn: (params: ParseTemplateMutationParams) =>
      useCases.parseTemplate.execute(params.template, params.variables),
  });
}

export { useParseTemplateMutation };
export type { ParseTemplateMutationParams };

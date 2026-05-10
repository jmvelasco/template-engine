import { useState } from "react";
import { Maybe } from "../utils/Maybe";
import type { ParsingResult } from "../types/api";

export interface VariableRow {
  id: string;
  key: string;
  value: string | null;
}

export interface TemplateParserState {
  templateContent: string;
  variables: VariableRow[];
  result: Maybe<ParsingResult>;
  isParsing: boolean;
  error: Maybe<string>;
}

export interface TemplateParserDependencies {
  parseTemplate: (
    templateContent: string,
    variables: Record<string, string | null>,
  ) => Promise<ParsingResult>;
}

export function useTemplateParser(_dependencies: TemplateParserDependencies) {
  const [state] = useState<TemplateParserState>({
    templateContent: "",
    variables: [],
    result: Maybe.none<ParsingResult>(),
    isParsing: false,
    error: Maybe.none<string>(),
  });

  return {
    templateContent: state.templateContent,
    variables: state.variables,
    isParsing: state.isParsing,
    result: state.result,
    error: state.error,
  };
}

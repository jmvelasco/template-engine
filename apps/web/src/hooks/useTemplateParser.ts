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
  const [state, setState] = useState<TemplateParserState>({
    templateContent: "",
    variables: [],
    result: Maybe.none<ParsingResult>(),
    isParsing: false,
    error: Maybe.none<string>(),
  });

  const updateTemplateContent = (templateContent: string): void => {
    setState((prev) => ({ ...prev, templateContent }));
  };

  const addVariable = (): void => {
    const newRow: VariableRow = {
      id: String(Date.now() + Math.random()),
      key: "",
      value: "",
    };
    setState((prev) => ({
      ...prev,
      variables: [...prev.variables, newRow],
    }));
  };

  const updateVariableKey = (id: string, key: string): void => {
    setState((prev) => ({
      ...prev,
      variables: prev.variables.map((row) =>
        row.id === id ? { ...row, key } : row,
      ),
    }));
  };

  const updateVariableValue = (id: string, value: string | null): void => {
    setState((prev) => ({
      ...prev,
      variables: prev.variables.map((row) =>
        row.id === id ? { ...row, value } : row,
      ),
    }));
  };

  const removeVariable = (id: string): void => {
    setState((prev) => ({
      ...prev,
      variables: prev.variables.filter((row) => row.id !== id),
    }));
  };

  return {
    templateContent: state.templateContent,
    variables: state.variables,
    isParsing: state.isParsing,
    result: state.result,
    error: state.error,
    updateTemplateContent,
    addVariable,
    updateVariableKey,
    updateVariableValue,
    removeVariable,
  };
}

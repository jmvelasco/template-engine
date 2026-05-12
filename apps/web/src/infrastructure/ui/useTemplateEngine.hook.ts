import { useState } from "react";
import type { ParseResponse } from "@template-engine/api-types";
import type { TemplateEnginePort } from "../../domain/TemplateEnginePort";

interface VariableRow {
  key: string;
  value: string;
}

interface TemplateEngineState {
  template: string;
  variables: VariableRow[];
  result: ParseResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: TemplateEngineState = {
  template: "",
  variables: [],
  result: null,
  loading: false,
  error: null,
};

export function useTemplateEngine(_port: TemplateEnginePort) {
  const [state, setState] = useState<TemplateEngineState>(initialState);

  const updateTemplate = (_template: string) => {};
  const addVariable = () => {};
  const removeVariable = (_index: number) => {};
  const updateVariableKey = (_index: number, _key: string) => {};
  const updateVariableValue = (_index: number, _value: string) => {};
  const parse = async () => {};

  return {
    template: state.template,
    variables: state.variables,
    result: state.result,
    loading: state.loading,
    error: state.error,
    updateTemplate,
    addVariable,
    removeVariable,
    updateVariableKey,
    updateVariableValue,
    parse,
  };
}

import { useState } from "react";
import type { ParseResponse } from "@template-engine/api-types";
import type { TemplateEngine } from "../../domain/TemplateEngine";

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

export function useTemplateEngine(port: TemplateEngine) {
  const [state, setState] = useState<TemplateEngineState>(initialState);

  const updateTemplate = (template: string) => {
    setState((prev) => ({ ...prev, template }));
  };

  const addVariable = () => {
    setState((prev) => ({
      ...prev,
      variables: [...prev.variables, { key: "", value: "" }],
    }));
  };

  const removeVariable = (index: number) => {
    setState((prev) => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index),
    }));
  };

  const updateVariableKey = (index: number, key: string) => {
    setState((prev) => ({
      ...prev,
      variables: prev.variables.map((v, i) =>
        i === index ? { ...v, key } : v,
      ),
    }));
  };

  const updateVariableValue = (index: number, value: string) => {
    setState((prev) => ({
      ...prev,
      variables: prev.variables.map((v, i) =>
        i === index ? { ...v, value } : v,
      ),
    }));
  };

  const buildVariablesRecord = (
    variables: VariableRow[],
  ): Record<string, string> => {
    return variables.reduce<Record<string, string>>((acc, row) => {
      if (row.key.trim() !== "") {
        acc[row.key] = row.value;
      }
      return acc;
    }, {});
  };

  const parse = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const variablesRecord = buildVariablesRecord(state.variables);
      const result = await port.parse(state.template, variablesRecord);
      setState((prev) => ({ ...prev, result, loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setState((prev) => ({
        ...prev,
        error: message,
        loading: false,
        result: null,
      }));
    }
  };

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

import { useState } from "react";
import {
  TemplateParserClient,
  ParseEvent,
} from "../../api/template-parser-client";

export interface VariableRow {
  id: string;
  key: string;
  value: string;
}

interface TemplateParserState {
  template: string;
  variableRows: VariableRow[];
  parsedText: string;
  events: ParseEvent[];
  isLoading: boolean;
  error: string | null;
}

const defaultClient = new TemplateParserClient();

const initialState: TemplateParserState = {
  template: "Hello, ${name}!",
  variableRows: [{ id: "1", key: "name", value: "Ada Lovelace" }],
  parsedText: "",
  events: [],
  isLoading: false,
  error: null,
};

export function useTemplateParser(
  client: TemplateParserClient = defaultClient,
) {
  // Single useState with Grouped State
  const [state, setState] = useState<TemplateParserState>(initialState);

  // Behavior actions (no useCallback/useMemo)
  const setTemplate = (value: string) => {
    setState((prev) => ({ ...prev, template: value }));
  };

  const addVariableRow = () => {
    setState((prev) => ({
      ...prev,
      variableRows: [
        ...prev.variableRows,
        { id: Math.random().toString(36).substring(2, 9), key: "", value: "" },
      ],
    }));
  };

  const updateVariableRow = (
    id: string,
    updates: Partial<Omit<VariableRow, "id">>,
  ) => {
    setState((prev) => ({
      ...prev,
      variableRows: prev.variableRows.map((row) =>
        row.id === id ? { ...row, ...updates } : row,
      ),
    }));
  };

  const deleteVariableRow = (id: string) => {
    setState((prev) => ({
      ...prev,
      variableRows: prev.variableRows.filter((row) => row.id !== id),
    }));
  };

  const parseTemplate = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Build variables dictionary from row entries
      const variables: Record<string, string | null> = {};
      for (const row of state.variableRows) {
        if (row.key.trim() !== "") {
          variables[row.key] = row.value === "" ? null : row.value;
        }
      }

      const response = await client.parse(state.template, variables);

      setState((prev) => ({
        ...prev,
        parsedText: response.parsedText,
        events: response.events,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to parse template.";
      setState((prev) => ({
        ...prev,
        error: message,
        parsedText: "",
        events: [],
        isLoading: false,
      }));
    }
  };

  // Encapsulated state and behavior (no raw state or setState exported)
  return {
    template: state.template,
    variableRows: state.variableRows,
    parsedText: state.parsedText,
    events: state.events,
    isLoading: state.isLoading,
    error: state.error,
    setTemplate,
    addVariableRow,
    updateVariableRow,
    deleteVariableRow,
    parseTemplate,
  };
}

import { useState, useCallback } from "react";
import {
  TemplateParserClient,
  ParseEvent,
} from "../../api/template-parser-client";

export interface VariableRow {
  id: string;
  key: string;
  value: string;
}

const defaultClient = new TemplateParserClient();

export function useTemplateParser(
  client: TemplateParserClient = defaultClient,
) {
  const [template, setTemplate] = useState("Hello, ${name}!");
  const [variableRows, setVariableRows] = useState<VariableRow[]>([
    { id: "1", key: "name", value: "Ada Lovelace" },
  ]);
  const [parsedText, setParsedText] = useState("");
  const [events, setEvents] = useState<ParseEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addVariableRow = useCallback(() => {
    setVariableRows((rows) => [
      ...rows,
      { id: Math.random().toString(36).substring(2, 9), key: "", value: "" },
    ]);
  }, []);

  const updateVariableRow = useCallback(
    (id: string, updates: Partial<Omit<VariableRow, "id">>) => {
      setVariableRows((rows) =>
        rows.map((row) => (row.id === id ? { ...row, ...updates } : row)),
      );
    },
    [],
  );

  const deleteVariableRow = useCallback((id: string) => {
    setVariableRows((rows) => rows.filter((row) => row.id !== id));
  }, []);

  const parseTemplate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build variables dictionary from row entries
      const variables: Record<string, string | null> = {};
      for (const row of variableRows) {
        if (row.key.trim() !== "") {
          variables[row.key] = row.value === "" ? null : row.value;
        }
      }

      const response = await client.parse(template, variables);
      setParsedText(response.parsedText);
      setEvents(response.events);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to parse template.";
      setError(message);
      setParsedText("");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [template, variableRows, client]);

  return {
    template,
    setTemplate,
    variableRows,
    addVariableRow,
    updateVariableRow,
    deleteVariableRow,
    parsedText,
    events,
    isLoading,
    error,
    parseTemplate,
  };
}

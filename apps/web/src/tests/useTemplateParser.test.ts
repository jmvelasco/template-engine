import { test, expect, describe } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTemplateParser } from "../infrastructure/ui/App/useTemplateParser";

describe("The useTemplateParser hook", () => {
  test("initializes states with default values", () => {
    const { result } = renderHook(() => useTemplateParser());

    expect(result.current.template).toBe("Hello, ${name}!");
    expect(result.current.variableRows).toHaveLength(1);
    expect(result.current.variableRows[0].key).toBe("name");
    expect(result.current.variableRows[0].value).toBe("Ada Lovelace");
    expect(result.current.parsedText).toBe("");
    expect(result.current.events).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("updates template text", () => {
    const { result } = renderHook(() => useTemplateParser());

    act(() => {
      result.current.setTemplate("Welcome, ${user}!");
    });

    expect(result.current.template).toBe("Welcome, ${user}!");
  });

  test("manages variable rows: add, update, delete", () => {
    const { result } = renderHook(() => useTemplateParser());

    // Add a new row
    act(() => {
      result.current.addVariableRow();
    });

    expect(result.current.variableRows).toHaveLength(2);
    const newRowId = result.current.variableRows[1].id;
    expect(result.current.variableRows[1].key).toBe("");
    expect(result.current.variableRows[1].value).toBe("");

    // Update the row
    act(() => {
      result.current.updateVariableRow(newRowId, { key: "age", value: "30" });
    });

    expect(result.current.variableRows[1].key).toBe("age");
    expect(result.current.variableRows[1].value).toBe("30");

    // Delete the row
    act(() => {
      result.current.deleteVariableRow(newRowId);
    });

    expect(result.current.variableRows).toHaveLength(1);
  });

  test("parses template successfully calling the client", async () => {
    const fakeClient = {
      parse: async (
        _template: string,
        _variables: Record<string, string | null>,
      ) => {
        return {
          parsedText: "Hello John!",
          events: [
            { type: "SUCCESS" as const, message: "Replaced ${name} with 'John'" },
          ],
        };
      },
    } as any;

    const { result } = renderHook(() => useTemplateParser(fakeClient));

    // Initially output is empty
    expect(result.current.parsedText).toBe("");

    // Trigger parsing
    await act(async () => {
      await result.current.parseTemplate();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.parsedText).toBe("Hello John!");
    expect(result.current.events).toEqual([
      { type: "SUCCESS", message: "Replaced ${name} with 'John'" },
    ]);
  });

  test("handles error when parser client throws", async () => {
    const fakeClient = {
      parse: async () => {
        throw new Error("Parser service unavailable.");
      },
    } as any;

    const { result } = renderHook(() => useTemplateParser(fakeClient));

    await act(async () => {
      await result.current.parseTemplate();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Parser service unavailable.");
    expect(result.current.parsedText).toBe("");
    expect(result.current.events).toEqual([]);
  });
});

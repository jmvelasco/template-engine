import { renderHook, act } from "@testing-library/react";
import { useTemplateParser } from "../useTemplateParser";
import type { ParsingResult } from "../../types/api";

describe("The useTemplateParser Hook", () => {
  const mockParseTemplate = vi.fn();
  const dependencies = { parseTemplate: mockParseTemplate };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("initializes with empty template, no variables, and empty results", () => {
    const { result } = renderHook(() => useTemplateParser(dependencies));

    expect(result.current.templateContent).toBe("");
    expect(result.current.variables).toEqual([]);
    expect(result.current.isParsing).toBe(false);
    expect(result.current.result.isNone()).toBe(true);
    expect(result.current.error.isNone()).toBe(true);
  });

  test("allows updating the template content", () => {
    const { result } = renderHook(() => useTemplateParser(dependencies));

    act(() => {
      result.current.updateTemplateContent("New content");
    });

    expect(result.current.templateContent).toBe("New content");
  });

  test("allows adding, editing, and removing variable rows", () => {
    const { result } = renderHook(() => useTemplateParser(dependencies));

    // 1. Add row
    act(() => {
      result.current.addVariable();
    });

    expect(result.current.variables.length).toBe(1);
    const rowId = result.current.variables[0].id;
    expect(result.current.variables[0].key).toBe("");
    expect(result.current.variables[0].value).toBe("");

    // 2. Edit key
    act(() => {
      result.current.updateVariableKey(rowId, "name");
    });

    expect(result.current.variables[0].key).toBe("name");

    // 3. Edit value
    act(() => {
      result.current.updateVariableValue(rowId, "Ada");
    });

    expect(result.current.variables[0].value).toBe("Ada");

    // 4. Remove row
    act(() => {
      result.current.removeVariable(rowId);
    });

    expect(result.current.variables.length).toBe(0);
  });

  test("submits template and variables to API and updates result successfully", async () => {
    const expectedResult: ParsingResult = {
      renderedText: "Hello, Ada!",
      status: "SUCCESS",
      notifications: [],
    };
    mockParseTemplate.mockResolvedValueOnce(expectedResult);

    const { result } = renderHook(() => useTemplateParser(dependencies));

    act(() => {
      result.current.updateTemplateContent("Hello, ${name}!");
      result.current.addVariable();
    });

    const rowId = result.current.variables[0].id;
    act(() => {
      result.current.updateVariableKey(rowId, "name");
      result.current.updateVariableValue(rowId, "Ada");
    });

    // Run the async parsing
    let promise: Promise<void>;
    act(() => {
      promise = result.current.parse();
    });

    // isParsing should be true during parsing
    expect(result.current.isParsing).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.isParsing).toBe(false);
    expect(result.current.result.isSome()).toBe(true);
    expect(result.current.result.getOrNull()?.renderedText).toBe("Hello, Ada!");
    expect(result.current.result.getOrNull()?.status).toBe("SUCCESS");
    expect(result.current.error.isNone()).toBe(true);
    expect(mockParseTemplate).toHaveBeenCalledWith("Hello, ${name}!", {
      name: "Ada",
    });
  });

  test("handles API errors gracefully", async () => {
    mockParseTemplate.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useTemplateParser(dependencies));

    // Run the async parsing
    let promise: Promise<void>;
    act(() => {
      promise = result.current.parse();
    });

    await act(async () => {
      await promise;
    });

    expect(result.current.isParsing).toBe(false);
    expect(result.current.result.isNone()).toBe(true);
    expect(result.current.error.isSome()).toBe(true);
    expect(result.current.error.getOrNull()).toBe("Network error");
  });
});

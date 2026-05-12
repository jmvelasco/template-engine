import { describe, test, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTemplateEngine } from "../infrastructure/ui/useTemplateEngine.hook";
import type { TemplateEnginePort } from "../domain/TemplateEnginePort";
import type { ParseResponse } from "@template-engine/api-types";

function createFakePort(response: ParseResponse): TemplateEnginePort {
  return {
    parse: vi.fn().mockResolvedValue(response),
  };
}

function createFailingPort(errorMessage: string): TemplateEnginePort {
  return {
    parse: vi.fn().mockRejectedValue(new Error(errorMessage)),
  };
}

describe("The useTemplateEngine hook", () => {
  test("starts with empty template and no variables", () => {
    const port = createFakePort({
      text: "",
      status: "success",
      notifications: [],
    });

    const { result } = renderHook(() => useTemplateEngine(port));

    expect(result.current.template).toBe("");
    expect(result.current.variables).toEqual([]);
    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("updates template text", () => {
    const port = createFakePort({
      text: "",
      status: "success",
      notifications: [],
    });
    const { result } = renderHook(() => useTemplateEngine(port));

    act(() => {
      result.current.updateTemplate("Hello, ${name}!");
    });

    expect(result.current.template).toBe("Hello, ${name}!");
  });

  test("adds a variable row", () => {
    const port = createFakePort({
      text: "",
      status: "success",
      notifications: [],
    });
    const { result } = renderHook(() => useTemplateEngine(port));

    act(() => {
      result.current.addVariable();
    });

    expect(result.current.variables).toEqual([{ key: "", value: "" }]);
  });

  test("removes a variable by index", () => {
    const port = createFakePort({
      text: "",
      status: "success",
      notifications: [],
    });
    const { result } = renderHook(() => useTemplateEngine(port));

    act(() => {
      result.current.addVariable();
      result.current.addVariable();
    });
    act(() => {
      result.current.removeVariable(0);
    });

    expect(result.current.variables).toHaveLength(1);
  });

  test("updates a variable key", () => {
    const port = createFakePort({
      text: "",
      status: "success",
      notifications: [],
    });
    const { result } = renderHook(() => useTemplateEngine(port));

    act(() => {
      result.current.addVariable();
    });
    act(() => {
      result.current.updateVariableKey(0, "name");
    });

    expect(result.current.variables[0].key).toBe("name");
  });

  test("updates a variable value", () => {
    const port = createFakePort({
      text: "",
      status: "success",
      notifications: [],
    });
    const { result } = renderHook(() => useTemplateEngine(port));

    act(() => {
      result.current.addVariable();
    });
    act(() => {
      result.current.updateVariableValue(0, "Alice");
    });

    expect(result.current.variables[0].value).toBe("Alice");
  });

  test("parses template and returns result", async () => {
    const expectedResponse: ParseResponse = {
      text: "Hello, Alice!",
      status: "success",
      notifications: [
        { type: "success", message: "Replaced placeholder: name" },
      ],
    };
    const port = createFakePort(expectedResponse);
    const { result } = renderHook(() => useTemplateEngine(port));

    act(() => {
      result.current.updateTemplate("Hello, ${name}!");
      result.current.addVariable();
    });
    act(() => {
      result.current.updateVariableKey(0, "name");
      result.current.updateVariableValue(0, "Alice");
    });

    await act(async () => {
      await result.current.parse();
    });

    expect(result.current.result).toEqual(expectedResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(port.parse).toHaveBeenCalledWith("Hello, ${name}!", {
      name: "Alice",
    });
  });

  test("sets error on parse failure", async () => {
    const port = createFailingPort("Network error");
    const { result } = renderHook(() => useTemplateEngine(port));

    act(() => {
      result.current.updateTemplate("Hello!");
    });

    await act(async () => {
      await result.current.parse();
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBeNull();
  });
});

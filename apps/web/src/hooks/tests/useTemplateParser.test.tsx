import { renderHook } from "@testing-library/react";
import { useTemplateParser } from "../useTemplateParser";

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
});

import { render, screen } from "@testing-library/react";
import { ParseResultDisplay } from "./ParseResultDisplay";
import type { ParseResult } from "../../domain/parse-result";

describe("ParseResultDisplay", () => {
  test("displays parsed text", () => {
    const result: ParseResult = {
      text: "Hello, Ada!",
      notifications: [],
    };
    render(<ParseResultDisplay result={result} />);

    expect(screen.getByText("Hello, Ada!")).toBeInTheDocument();
  });

  test("displays replaced notification with success indicator", () => {
    const result: ParseResult = {
      text: "Hello, Ada!",
      notifications: [
        { type: "replaced", key: "name", value: "Ada", occurrences: 1 },
      ],
    };
    render(<ParseResultDisplay result={result} />);

    expect(screen.getByText(/replaced/i)).toBeInTheDocument();
    expect(screen.getByText(/name/)).toBeInTheDocument();
  });

  test("displays missing-variable notification with warning indicator", () => {
    const result: ParseResult = {
      text: "Hello, ${name}!",
      notifications: [{ type: "missing-variable", key: "name" }],
    };
    render(<ParseResultDisplay result={result} />);

    expect(screen.getByText(/missing/i)).toBeInTheDocument();
  });

  test("displays null-value notification with warning indicator", () => {
    const result: ParseResult = {
      text: "Hello, ${name}!",
      notifications: [{ type: "null-value", key: "name" }],
    };
    render(<ParseResultDisplay result={result} />);

    expect(screen.getByText(/null/i)).toBeInTheDocument();
  });

  test("displays unused-variable notification with info indicator", () => {
    const result: ParseResult = {
      text: "Hello!",
      notifications: [{ type: "unused-variable", key: "extra" }],
    };
    render(<ParseResultDisplay result={result} />);

    expect(screen.getByText(/unused/i)).toBeInTheDocument();
  });
});

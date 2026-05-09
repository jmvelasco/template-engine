import { render, screen, fireEvent } from "@testing-library/react";
import { TemplateInput } from "./TemplateInput";

describe("TemplateInput", () => {
  test("renders a textarea for template input", () => {
    render(<TemplateInput value="" onChange={() => {}} />);

    expect(
      screen.getByRole("textbox", { name: /template/i }),
    ).toBeInTheDocument();
  });

  test("calls onChange when user types in the textarea", () => {
    const handleChange = vi.fn();
    render(<TemplateInput value="" onChange={handleChange} />);

    fireEvent.change(screen.getByRole("textbox", { name: /template/i }), {
      target: { value: "Hello, ${name}!" },
    });

    expect(handleChange).toHaveBeenCalledWith("Hello, ${name}!");
  });

  test("displays the provided value", () => {
    render(<TemplateInput value="Hello!" onChange={() => {}} />);

    expect(screen.getByRole("textbox", { name: /template/i })).toHaveValue(
      "Hello!",
    );
  });
});

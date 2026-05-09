import { render, screen, fireEvent } from "@testing-library/react";
import { VariablesInput } from "./VariablesInput";

describe("VariablesInput", () => {
  test("renders key and value input fields", () => {
    render(<VariablesInput variables={{}} onChange={() => {}} />);

    expect(screen.getByLabelText(/key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument();
  });

  test("adds a variable when user fills key and value and clicks add", () => {
    const handleChange = vi.fn();
    render(<VariablesInput variables={{}} onChange={handleChange} />);

    fireEvent.change(screen.getByLabelText(/key/i), {
      target: { value: "name" },
    });
    fireEvent.change(screen.getByLabelText(/value/i), {
      target: { value: "Ada" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(handleChange).toHaveBeenCalledWith({ name: "Ada" });
  });

  test("displays existing variables", () => {
    render(
      <VariablesInput
        variables={{ name: "Ada", age: "25" }}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("age")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  test("removes a variable when user clicks remove", () => {
    const handleChange = vi.fn();
    render(
      <VariablesInput variables={{ name: "Ada" }} onChange={handleChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    expect(handleChange).toHaveBeenCalledWith({});
  });
});

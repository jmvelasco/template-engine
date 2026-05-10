import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TemplatePage } from "./TemplatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TemplateUseCasesContext } from "../../infrastructure/context/template-use-cases-context";
import type { ParseTemplateUseCase } from "../../domain/parse-template-use-case";

function renderWithProviders(parseTemplate: ParseTemplateUseCase) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <TemplateUseCasesContext.Provider value={{ parseTemplate }}>
        <TemplatePage />
      </TemplateUseCasesContext.Provider>
    </QueryClientProvider>,
  );
}

describe("TemplatePage", () => {
  test("renders template input, variables input, and parse button", () => {
    const stubUseCase: ParseTemplateUseCase = {
      execute: vi.fn().mockResolvedValue({ text: "", notifications: [] }),
    };
    renderWithProviders(stubUseCase);

    expect(
      screen.getByRole("textbox", { name: /template/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/key/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /parse/i })).toBeInTheDocument();
  });

  test("calls mutation and displays result when parse button is clicked", async () => {
    const stubUseCase: ParseTemplateUseCase = {
      execute: vi.fn().mockResolvedValue({
        text: "Hello, Ada!",
        notifications: [
          { type: "replaced", key: "name", value: "Ada", occurrences: 1 },
        ],
      }),
    };
    renderWithProviders(stubUseCase);

    fireEvent.change(screen.getByRole("textbox", { name: /template/i }), {
      target: { value: "Hello, ${name}!" },
    });
    fireEvent.change(screen.getByLabelText(/key/i), {
      target: { value: "name" },
    });
    fireEvent.change(screen.getByLabelText(/value/i), {
      target: { value: "Ada" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    fireEvent.click(screen.getByRole("button", { name: /parse/i }));

    await waitFor(() => {
      expect(screen.getByText("Hello, Ada!")).toBeInTheDocument();
    });

    expect(screen.getByText(/replaced/i)).toBeInTheDocument();
  });

  test("displays error message when mutation fails", async () => {
    const stubUseCase: ParseTemplateUseCase = {
      execute: vi.fn().mockRejectedValue(new Error("Network error")),
    };
    renderWithProviders(stubUseCase);

    fireEvent.click(screen.getByRole("button", { name: /parse/i }));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});

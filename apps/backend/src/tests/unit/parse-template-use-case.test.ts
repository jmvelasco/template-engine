import { describe, test, expect } from "@jest/globals";
import { ParseTemplateUseCase } from "../../application/ParseTemplateUseCase";

describe("The ParseTemplateUseCase", () => {
  test("delegates parsing to TemplateEngine and returns the result", () => {
    const useCase = new ParseTemplateUseCase();

    const result = useCase.execute("Hello, ${name}!", { name: "Alice" });

    expect(result.text).toBe("Hello, Alice!");
    expect(result.status()).toBe("success");
    expect(result.notifications).toEqual([
      { type: "success", message: "Replaced placeholder: name" },
    ]);
  });
});

import { test, expect, describe } from "@jest/globals";
import { ParseTemplateUseCase } from "../application/use-cases/parse-template.use-case";
import { ParseNotifier, ParseEvent } from "../domain/ports/parse-notifier";

class SpyParseNotifier implements ParseNotifier {
  public readonly events: ParseEvent[] = [];

  notify(event: ParseEvent): void {
    this.events.push(event);
  }
}

describe("The ParseTemplateUseCase", () => {
  test("orchestrates the parse process using the domain parse service", () => {
    const useCase = new ParseTemplateUseCase();
    const notifier = new SpyParseNotifier();

    const result = useCase.execute(
      {
        template: "Welcome ${name}!",
        variables: { name: "John" },
      },
      notifier,
    );

    expect(result).toBe("Welcome John!");
    expect(notifier.events).toEqual([
      { type: "SUCCESS", message: "Replaced ${name} with 'John'" },
    ]);
  });
});

import { describe, test, expect } from "@jest/globals";
import { ParseResult } from "../../domain/ParseResult";
import { Notification } from "../../domain/Notification";

describe("The ParseResult", () => {
  test("exposes text and notifications", () => {
    const notifications = [Notification.success("done")];
    const result = ParseResult.create("Hello John!", notifications);

    expect(result.text).toBe("Hello John!");
    expect(result.notifications).toEqual([
      { type: "success", message: "done" },
    ]);
  });

  test("exposes empty notifications when none provided", () => {
    const result = ParseResult.create("Hello!", []);

    expect(result.text).toBe("Hello!");
    expect(result.notifications).toEqual([]);
  });
});

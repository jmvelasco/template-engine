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

  describe("derives status from notifications", () => {
    test("returns success when all notifications are success", () => {
      const result = ParseResult.create("text", [
        Notification.success("done"),
        Notification.success("also done"),
      ]);

      expect(result.status()).toBe("success");
    });

    test("returns success when notifications are success and info", () => {
      const result = ParseResult.create("text", [
        Notification.success("done"),
        Notification.info("note"),
      ]);

      expect(result.status()).toBe("success");
    });

    test("returns partial when notifications include success and warning", () => {
      const result = ParseResult.create("text", [
        Notification.success("done"),
        Notification.warning("missing"),
      ]);

      expect(result.status()).toBe("partial");
    });

    test("returns warning when notifications contain only warnings", () => {
      const result = ParseResult.create("text", [
        Notification.warning("not found"),
        Notification.warning("also not found"),
      ]);

      expect(result.status()).toBe("warning");
    });

    test("returns warning when notifications contain only info", () => {
      const result = ParseResult.create("text", [
        Notification.info("empty template"),
      ]);

      expect(result.status()).toBe("warning");
    });

    test("returns warning when notifications contain info and warning", () => {
      const result = ParseResult.create("text", [
        Notification.info("note"),
        Notification.warning("missing"),
      ]);

      expect(result.status()).toBe("warning");
    });
  });
});

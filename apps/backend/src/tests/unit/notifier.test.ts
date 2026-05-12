import { describe, test, expect } from "@jest/globals";
import { Notifier } from "../../domain/Notifier";

describe("The Notifier", () => {
  test("starts with an empty list of notifications", () => {
    const notifier = Notifier.create();

    expect(notifier.notifications()).toEqual([]);
  });

  test("accumulates a success notification", () => {
    const notifier = Notifier.create().addSuccess("done");

    expect(notifier.notifications()).toEqual([
      { type: "success", message: "done" },
    ]);
  });

  test("accumulates a warning notification", () => {
    const notifier = Notifier.create().addWarning("missing key");

    expect(notifier.notifications()).toEqual([
      { type: "warning", message: "missing key" },
    ]);
  });

  test("accumulates an error notification", () => {
    const notifier = Notifier.create().addError("failed");

    expect(notifier.notifications()).toEqual([
      { type: "error", message: "failed" },
    ]);
  });

  test("accumulates an info notification", () => {
    const notifier = Notifier.create().addInfo("empty template");

    expect(notifier.notifications()).toEqual([
      { type: "info", message: "empty template" },
    ]);
  });

  test("accumulates multiple notifications preserving order", () => {
    const notifier = Notifier.create()
      .addSuccess("replaced name")
      .addWarning("key not found")
      .addInfo("done");

    expect(notifier.notifications()).toEqual([
      { type: "success", message: "replaced name" },
      { type: "warning", message: "key not found" },
      { type: "info", message: "done" },
    ]);
  });

  test("does not mutate the original notifier when adding", () => {
    const original = Notifier.create();
    const withSuccess = original.addSuccess("done");

    expect(original.notifications()).toEqual([]);
    expect(withSuccess.notifications()).toEqual([
      { type: "success", message: "done" },
    ]);
  });
});

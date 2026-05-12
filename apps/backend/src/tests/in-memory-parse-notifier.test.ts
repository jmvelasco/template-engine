import { test, expect, describe } from "@jest/globals";
import { InMemoryParseNotifier } from "../infrastructure/adapters/in-memory-parse-notifier";

describe("The InMemoryParseNotifier adapter", () => {
  test("starts with an empty list of events", () => {
    const notifier = new InMemoryParseNotifier();
    expect(notifier.getEvents()).toEqual([]);
  });

  test("accumulates notified events", () => {
    const notifier = new InMemoryParseNotifier();

    notifier.notify({ type: "SUCCESS", message: "first success" });
    notifier.notify({ type: "WARNING", message: "first warning" });

    expect(notifier.getEvents()).toEqual([
      { type: "SUCCESS", message: "first success" },
      { type: "WARNING", message: "first warning" },
    ]);
  });
});

import { describe, test, expect } from "@jest/globals";
import { Notification } from "../../domain/Notification";

describe("The Notification", () => {
  test("creates a success notification with a message", () => {
    const notification = Notification.success("Replaced ${name} with 'John'");

    expect(notification.type).toBe("success");
    expect(notification.message).toBe("Replaced ${name} with 'John'");
  });

  test("creates a warning notification with a message", () => {
    const notification = Notification.warning(
      "Variable 'extra' not found in template",
    );

    expect(notification.type).toBe("warning");
    expect(notification.message).toBe("Variable 'extra' not found in template");
  });

  test("creates an error notification with a message", () => {
    const notification = Notification.error("Processing failed");

    expect(notification.type).toBe("error");
    expect(notification.message).toBe("Processing failed");
  });

  test("creates an info notification with a message", () => {
    const notification = Notification.info("Template is empty");

    expect(notification.type).toBe("info");
    expect(notification.message).toBe("Template is empty");
  });
});

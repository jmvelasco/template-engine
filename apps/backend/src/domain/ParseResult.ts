import { Notification } from "./Notification";
import type { ParseStatus } from "@template-engine/api-types";

export class ParseResult {
  private constructor(
    readonly text: string,
    readonly notifications: Notification[],
  ) {}

  static create(text: string, notifications: Notification[]): ParseResult {
    return new ParseResult(text, notifications);
  }

  status(): ParseStatus {
    const hasSuccess = this.notifications.some((n) => n.type === "success");
    const hasWarningOrError = this.notifications.some(
      (n) => n.type === "warning" || n.type === "error",
    );

    if (hasSuccess && hasWarningOrError) return "partial";
    if (hasSuccess) return "success";
    return "warning";
  }
}

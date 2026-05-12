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
    return undefined as unknown as ParseStatus;
  }
}

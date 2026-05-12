import { Notification } from "./Notification";

export class ParseResult {
  private constructor(
    readonly text: string,
    readonly notifications: Notification[],
  ) {}

  static create(text: string, notifications: Notification[]): ParseResult {
    return new ParseResult(text, notifications);
  }
}

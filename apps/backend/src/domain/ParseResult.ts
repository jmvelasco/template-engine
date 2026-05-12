import { Notification } from "./Notification";

export class ParseResult {
  private constructor(
    readonly text: string,
    readonly notifications: Notification[],
  ) {}

  static create(_text: string, _notifications: Notification[]): ParseResult {
    return undefined as unknown as ParseResult;
  }
}

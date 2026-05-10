import { ParsingNotifier } from "./ParsingNotifier";
import { ParsingResult } from "./types";

export class Template {
  private constructor(public readonly value: string) {}

  static create(value: string): Template {
    return new Template(value);
  }

  render(variables: Record<string, string | null>): ParsingResult {
    const notifier = new ParsingNotifier();
    return {
      renderedText: this.value,
      status: "SUCCESS",
      notifications: notifier.getNotifications(),
    };
  }
}

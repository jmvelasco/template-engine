import { ParsingNotifier } from "./ParsingNotifier";
import { ParsingResult } from "./types";

export class Template {
  private constructor(public readonly value: string) {}

  static create(value: string): Template {
    return new Template(value);
  }

  render(variables: Record<string, string | null>): ParsingResult {
    const notifier = new ParsingNotifier();
    let renderedText = this.value;

    const regex = /\${([^}]+)}/g;
    let match;
    const matches: string[] = [];

    while ((match = regex.exec(this.value)) !== null) {
      matches.push(match[1]);
    }

    const uniqueKeysInTemplate = Array.from(new Set(matches));

    for (const key of uniqueKeysInTemplate) {
      const value = variables[key];
      if (value !== undefined && value !== null) {
        renderedText = renderedText.replaceAll(`\${${key}}`, value);
      }
    }

    return {
      renderedText,
      status: "SUCCESS",
      notifications: notifier.getNotifications(),
    };
  }
}

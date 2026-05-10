import { ParsingNotifier } from "./ParsingNotifier";
import { ParsingResult, ParsingStatus } from "./types";

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

    if (uniqueKeysInTemplate.length === 0) {
      return {
        renderedText,
        status: "SUCCESS",
        notifications: notifier.getNotifications(),
      };
    }

    let resolvedCount = 0;
    let unresolvedCount = 0;

    for (const key of uniqueKeysInTemplate) {
      const value = variables[key];

      if (value === undefined) {
        unresolvedCount++;
        notifier.notify(
          "WARNING",
          `Variable '${key}' is required but was not provided in the dictionary.`,
          "MISSING_VARIABLE",
          { key }
        );
      } else if (value === null) {
        unresolvedCount++;
        notifier.notify(
          "WARNING",
          `Variable '${key}' has a null value.`,
          "NULL_VARIABLE_VALUE",
          { key }
        );
      } else {
        resolvedCount++;
        renderedText = renderedText.replaceAll(`\${${key}}`, value);
      }
    }

    let status: ParsingStatus = "SUCCESS";
    if (resolvedCount === 0) {
      status = "FAILED";
    } else if (unresolvedCount > 0) {
      status = "PARTIAL";
    }

    return {
      renderedText,
      status,
      notifications: notifier.getNotifications(),
    };
  }
}

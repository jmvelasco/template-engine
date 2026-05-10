import { ParsingNotifier } from "./ParsingNotifier";
import { ParsingResult, ParsingStatus } from "./types";

export class Template {
  private constructor(public readonly value: string) {}

  static create(value: string): Template {
    return new Template(value);
  }

  render(variables: Record<string, string | null>): ParsingResult {
    const notifier = new ParsingNotifier();
    const keysInTemplate = this.extractKeys();

    this.checkUnusedVariables(keysInTemplate, variables, notifier);

    if (keysInTemplate.length === 0) {
      return {
        renderedText: this.value,
        status: "SUCCESS",
        notifications: notifier.getNotifications(),
      };
    }

    const { renderedText, resolvedCount, unresolvedCount } = this.processKeys(
      keysInTemplate,
      variables,
      notifier,
    );

    const status = this.determineStatus(resolvedCount, unresolvedCount);

    return {
      renderedText,
      status,
      notifications: notifier.getNotifications(),
    };
  }

  private extractKeys(): string[] {
    const regex = /\${([^}]+)}/g;
    let match;
    const matches: string[] = [];

    while ((match = regex.exec(this.value)) !== null) {
      matches.push(match[1]);
    }

    return Array.from(new Set(matches));
  }

  private checkUnusedVariables(
    keysInTemplate: string[],
    variables: Record<string, string | null>,
    notifier: ParsingNotifier,
  ): void {
    for (const key of Object.keys(variables)) {
      if (!keysInTemplate.includes(key)) {
        notifier.notify(
          "WARNING",
          `Variable '${key}' is defined in the dictionary but was not used in the template.`,
          "UNUSED_VARIABLE",
          { key },
        );
      }
    }
  }

  private processKeys(
    keysInTemplate: string[],
    variables: Record<string, string | null>,
    notifier: ParsingNotifier,
  ): { renderedText: string; resolvedCount: number; unresolvedCount: number } {
    let renderedText = this.value;
    let resolvedCount = 0;
    let unresolvedCount = 0;

    for (const key of keysInTemplate) {
      const value = variables[key];

      if (value === undefined) {
        unresolvedCount++;
        notifier.notify(
          "WARNING",
          `Variable '${key}' is required but was not provided in the dictionary.`,
          "MISSING_VARIABLE",
          { key },
        );
      } else if (value === null) {
        unresolvedCount++;
        notifier.notify(
          "WARNING",
          `Variable '${key}' has a null value.`,
          "NULL_VARIABLE_VALUE",
          { key },
        );
      } else {
        resolvedCount++;
        renderedText = renderedText.replaceAll(`\${${key}}`, value);
      }
    }

    return { renderedText, resolvedCount, unresolvedCount };
  }

  private determineStatus(
    resolvedCount: number,
    unresolvedCount: number,
  ): ParsingStatus {
    if (resolvedCount === 0) {
      return "FAILED";
    }

    if (unresolvedCount > 0) {
      return "PARTIAL";
    }

    return "SUCCESS";
  }
}

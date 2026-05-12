import { ParseResult } from "./ParseResult";
import { Notification } from "./Notification";

export class TemplateEngine {
  static parse(
    template: string,
    variables: Record<string, string | null>,
  ): ParseResult {
    if (template === "") {
      return ParseResult.create(template, [
        Notification.info("Template is empty, nothing to process"),
      ]);
    }

    const escapedPlaceholders = this.findEscapedPlaceholders(template);
    const workingTemplate = this.replaceEscapedWithTokens(template, escapedPlaceholders);
    const foundPlaceholders = this.findPlaceholders(workingTemplate);

    const notifications = [
      ...this.checkNoPlaceholders(foundPlaceholders),
      ...this.checkUnusedKeys(variables, foundPlaceholders),
      ...this.checkUnresolvedPlaceholders(foundPlaceholders, variables),
      ...this.checkNullPlaceholders(foundPlaceholders, variables),
    ];

    const { text: replacedText, notifications: replacementNotifications } =
      this.replacePlaceholders(workingTemplate, foundPlaceholders, variables);

    const resultText = this.restoreEscapedPlaceholders(replacedText, escapedPlaceholders);
    const escapedNotifications = escapedPlaceholders.map((name) =>
      Notification.info(`Escaped placeholder preserved as literal: ${name}`),
    );

    return ParseResult.create(resultText, [
      ...notifications,
      ...replacementNotifications,
      ...escapedNotifications,
    ]);
  }

  private static findEscapedPlaceholders(template: string): string[] {
    const pattern = /\\\$\{(\w+)\}/g;
    const results: string[] = [];
    let match;
    while ((match = pattern.exec(template)) !== null) {
      results.push(match[1]);
    }
    return results;
  }

  private static replaceEscapedWithTokens(template: string, escapedPlaceholders: string[]): string {
    const token = "\0ESCAPED_";
    return escapedPlaceholders.reduce(
      (text, name) => text.replaceAll(`\\$\{${name}}`, `${token}${name}\0`),
      template,
    );
  }

  private static restoreEscapedPlaceholders(text: string, escapedPlaceholders: string[]): string {
    const token = "\0ESCAPED_";
    return escapedPlaceholders.reduce(
      (result, name) => result.replaceAll(`${token}${name}\0`, `\${${name}}`),
      text,
    );
  }

  private static findPlaceholders(template: string): Set<string> {
    const pattern = /\$\{(\w+)\}/g;
    const results = new Set<string>();
    let match;
    while ((match = pattern.exec(template)) !== null) {
      results.add(match[1]);
    }
    return results;
  }

  private static checkNoPlaceholders(foundPlaceholders: Set<string>): Notification[] {
    if (foundPlaceholders.size === 0) {
      return [Notification.info("No placeholders found in template")];
    }
    return [];
  }

  private static checkUnusedKeys(
    variables: Record<string, string | null>,
    foundPlaceholders: Set<string>,
  ): Notification[] {
    return Object.keys(variables)
      .filter((key) => !foundPlaceholders.has(key))
      .map((key) => Notification.warning(`Unused variable: ${key}`));
  }

  private static checkUnresolvedPlaceholders(
    foundPlaceholders: Set<string>,
    variables: Record<string, string | null>,
  ): Notification[] {
    return [...foundPlaceholders]
      .filter((placeholder) => !(placeholder in variables))
      .map((placeholder) => Notification.warning(`Unresolved placeholder: ${placeholder}`));
  }

  private static checkNullPlaceholders(
    foundPlaceholders: Set<string>,
    variables: Record<string, string | null>,
  ): Notification[] {
    return [...foundPlaceholders]
      .filter((placeholder) => placeholder in variables && variables[placeholder] === null)
      .map((placeholder) => Notification.warning(`Null value for placeholder: ${placeholder}`));
  }

  private static replacePlaceholders(
    template: string,
    foundPlaceholders: Set<string>,
    variables: Record<string, string | null>,
  ): { text: string; notifications: Notification[] } {
    const placeholderSyntaxPattern = /\$\{.+\}/;
    const resolvedPlaceholders = [...foundPlaceholders].filter(
      (placeholder) => placeholder in variables && variables[placeholder] !== null,
    );

    const notifications: Notification[] = [];
    const text = resolvedPlaceholders.reduce((result, placeholder) => {
      const value = variables[placeholder]!;
      notifications.push(Notification.success(`Replaced placeholder: ${placeholder}`));
      if (placeholderSyntaxPattern.test(value)) {
        notifications.push(
          Notification.warning(`Value for '${placeholder}' contains placeholder-like syntax and was inserted as literal`),
        );
      }
      return result.replaceAll(`\${${placeholder}}`, value);
    }, template);

    return { text, notifications };
  }
}

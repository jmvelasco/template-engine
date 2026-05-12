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

    const escapedPattern = /\\\$\{(\w+)\}/g;
    const escapedPlaceholders: string[] = [];
    let escapedMatch;
    while ((escapedMatch = escapedPattern.exec(template)) !== null) {
      escapedPlaceholders.push(escapedMatch[1]);
    }
    let workingTemplate = template;
    const escapePlaceholder = "\0ESCAPED_";
    escapedPlaceholders.forEach((name) => {
      workingTemplate = workingTemplate.replaceAll(`\\$\{${name}}`, `${escapePlaceholder}${name}\0`);
    });

    const placeholderPattern = /\$\{(\w+)\}/g;
    const foundPlaceholders = new Set<string>();
    let match;
    while ((match = placeholderPattern.exec(workingTemplate)) !== null) {
      foundPlaceholders.add(match[1]);
    }

    const notifications: Notification[] = [];

    if (foundPlaceholders.size === 0) {
      notifications.push(Notification.info("No placeholders found in template"));
    }

    const unusedKeys = Object.keys(variables).filter(
      (key) => !foundPlaceholders.has(key),
    );
    unusedKeys.forEach((key) => {
      notifications.push(Notification.warning(`Unused variable: ${key}`));
    });

    const unresolvedPlaceholders = [...foundPlaceholders].filter(
      (placeholder) => !(placeholder in variables),
    );
    unresolvedPlaceholders.forEach((placeholder) => {
      notifications.push(Notification.warning(`Unresolved placeholder: ${placeholder}`));
    });

    const nullPlaceholders = [...foundPlaceholders].filter(
      (placeholder) => placeholder in variables && variables[placeholder] === null,
    );
    nullPlaceholders.forEach((placeholder) => {
      notifications.push(Notification.warning(`Null value for placeholder: ${placeholder}`));
    });

    let resultText = workingTemplate;
    const resolvedPlaceholders = [...foundPlaceholders].filter(
      (placeholder) => placeholder in variables && variables[placeholder] !== null,
    );
    resolvedPlaceholders.forEach((placeholder) => {
      const value = variables[placeholder]!;
      resultText = resultText.replaceAll(`\${${placeholder}}`, value);
      notifications.push(Notification.success(`Replaced placeholder: ${placeholder}`));
      if (/\$\{.+\}/.test(value)) {
        notifications.push(Notification.warning(`Value for '${placeholder}' contains placeholder-like syntax and was inserted as literal`));
      }
    });

    escapedPlaceholders.forEach((name) => {
      resultText = resultText.replaceAll(`${escapePlaceholder}${name}\0`, `\${${name}}`);
      notifications.push(Notification.info(`Escaped placeholder preserved as literal: ${name}`));
    });

    return ParseResult.create(resultText, notifications);
  }
}

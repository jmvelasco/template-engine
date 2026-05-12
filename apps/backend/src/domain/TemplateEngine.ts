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

    const placeholderPattern = /\$\{(\w+)\}/g;
    const foundPlaceholders = new Set<string>();
    let match;
    while ((match = placeholderPattern.exec(template)) !== null) {
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

    return ParseResult.create(template, notifications);
  }
}

type ReplacedNotification = {
  type: "replaced";
  key: string;
  value: string;
  occurrences: number;
};

type MissingVariableNotification = {
  type: "missing-variable";
  key: string;
};

type NullValueNotification = {
  type: "null-value";
  key: string;
};

type UnusedVariableNotification = {
  type: "unused-variable";
  key: string;
};

type ParseNotification =
  | ReplacedNotification
  | MissingVariableNotification
  | NullValueNotification
  | UnusedVariableNotification;

interface ParseResult {
  text: string;
  notifications: ParseNotification[];
}

class TemplateEngine {
  parse(
    template: string,
    variables: Record<string, string | null>,
  ): ParseResult {
    const placeholderPattern = /\$\{(\w+)\}/g;
    const placeholdersInTemplate = new Set(
      [...template.matchAll(placeholderPattern)].map((match) => match[1]),
    );

    const placeholderNotifications = this.processPlaceholders(
      template,
      placeholdersInTemplate,
      variables,
    );
    const unusedNotifications = this.detectUnusedVariables(
      placeholdersInTemplate,
      variables,
    );

    return {
      text: placeholderNotifications.parsedText,
      notifications: [
        ...placeholderNotifications.notifications,
        ...unusedNotifications,
      ],
    };
  }

  private processPlaceholders(
    template: string,
    placeholders: Set<string>,
    variables: Record<string, string | null>,
  ): { parsedText: string; notifications: ParseNotification[] } {
    let parsedText = template;
    const notifications: ParseNotification[] = [];

    for (const key of placeholders) {
      const variableNotProvided = !(key in variables);
      if (variableNotProvided) {
        notifications.push({ type: "missing-variable", key });
        continue;
      }
      const value = variables[key];
      if (value === null) {
        notifications.push({ type: "null-value", key });
        continue;
      }
      const placeholder = `\${${key}}`;
      const occurrences = parsedText.split(placeholder).length - 1;
      parsedText = parsedText.replaceAll(placeholder, value);
      notifications.push({ type: "replaced", key, value, occurrences });
    }

    return { parsedText, notifications };
  }

  private detectUnusedVariables(
    placeholders: Set<string>,
    variables: Record<string, string | null>,
  ): UnusedVariableNotification[] {
    return Object.keys(variables)
      .filter((key) => !placeholders.has(key))
      .map((key) => ({ type: "unused-variable" as const, key }));
  }
}

export { TemplateEngine };
export type { ParseResult, ParseNotification };

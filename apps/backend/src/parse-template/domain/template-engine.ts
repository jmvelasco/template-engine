function logger(message: string): void {
  process.stdout.write(message + "\n");
}

function render(
  template: string,
  variables: Record<string, string | null>,
): string {
  const key = Object.keys(variables).pop();
  const value = Object.values(variables).pop();
  if (!key) {
    logger(`No replacements done! key not found in the dictionary.`);
    return template;
  }
  if (!value) {
    logger(`No replacements done! key \${${key}} has no value.`);
    return template;
  }
  const placeholder = `\${${key}}`;
  const parsedTemplate = template.replaceAll(placeholder, value);
  delete variables[key];
  if (parsedTemplate === template) {
    logger(`No replacements done! key \${${key}} not found in the template.`);
  }

  return render(parsedTemplate, variables);
}

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

type ParseNotification = ReplacedNotification | MissingVariableNotification;

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

    if (placeholdersInTemplate.size === 0) {
      return { text: template, notifications: [] };
    }

    let parsedText = template;
    const notifications: ParseNotification[] = [];

    for (const key of placeholdersInTemplate) {
      const variableNotProvided = !(key in variables);
      if (variableNotProvided) {
        notifications.push({ type: "missing-variable", key });
        continue;
      }
      const value = variables[key];
      if (value === null) {
        continue;
      }
      const placeholder = `\${${key}}`;
      const occurrences = parsedText.split(placeholder).length - 1;
      parsedText = parsedText.replaceAll(placeholder, value);
      notifications.push({ type: "replaced", key, value, occurrences });
    }

    return { text: parsedText, notifications };
  }
}

export { render, logger, TemplateEngine };
export type { ParseResult, ParseNotification };

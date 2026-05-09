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

type ParseNotification = Record<string, unknown>;

interface ParseResult {
  text: string;
  notifications: ParseNotification[];
}

class TemplateEngine {
  parse(
    template: string,
    _variables: Record<string, string | null>,
  ): ParseResult {
    return { text: template, notifications: [] };
  }
}

export { render, logger, TemplateEngine };
export type { ParseResult, ParseNotification };

function logger(message: string): void {
  process.stdout.write(message + "\n");
}

function render(
  template: string,
  variables: Record<string, string | null>,
): string {
  const entries = Object.entries(variables);
  const entry = entries.pop();
  if (!entry) {
    logger(`No replacements done! key not found in the dictionary.`);
    return template;
  }
  const [key, value] = entry;
  if (!value) {
    logger(`No replacements done! key \${${key}} has no value.`);
    return render(template, Object.fromEntries(entries));
  }
  const placeholder = `\${${key}}`;
  const parsedTemplate = template.replaceAll(placeholder, value);
  if (parsedTemplate === template) {
    logger(`No replacements done! key \${${key}} not found in the template.`);
  }

  return render(parsedTemplate, Object.fromEntries(entries));
}

export { render, logger };

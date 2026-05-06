function logger(message: string): void {
  process.stdout.write(message + "\n");
}

function render(
  template: string,
  variables: Record<string, string | null>,
): string {
  const keys = Object.keys(variables);
  if (keys.length === 0) {
    logger(`No replacements done! key not found in the dictionary.`);
    return template;
  }

  let result = template;
  for (const key of keys) {
    const value = variables[key];
    if (!value) {
      logger(`No replacements done! key \${${key}} has no value.`);
      continue;
    }
    const placeholder = `\${${key}}`;
    const replaced = result.replaceAll(placeholder, value);
    if (replaced === result) {
      logger(`No replacements done! key \${${key}} not found in the template.`);
    }
    result = replaced;
  }

  return result;
}

export { render, logger };

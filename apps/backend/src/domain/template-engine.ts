function parse(
  template: string,
  variables: Record<string, string | null>,
): string {
  let parsedTemplate = template;

  for (const [key, value] of Object.entries(variables)) {
    if (value !== null) {
      const placeholder = `\${${key}}`;
      parsedTemplate = parsedTemplate.replaceAll(placeholder, value);
    }
  }

  return parsedTemplate;
}

export { parse };

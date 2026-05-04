function render(template: string, variables: Record<string, string>): string {
  const key = Object.keys(variables).pop();
  const value = Object.values(variables).pop();
  if (!key || !value) {
    return template;
  }
  const placeholder = `\${${key}}`;
  const parsedTemplate = template.replaceAll(placeholder, value);

  delete variables[key];
  return render(parsedTemplate, variables);
}

export { render };

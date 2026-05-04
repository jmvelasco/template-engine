function render(
  templateString: string,
  variables: Record<string, string>,
): string {
  const key = Object.keys(variables).pop();
  const value = Object.values(variables).pop();
  if (!key || !value) {
    return templateString;
  }
  const placeholder = `\${${key}}`;
  const transformedString = templateString.replaceAll(placeholder, value);

  delete variables[key];
  return render(transformedString, variables);
}

export { render };

interface RenderResult {
  value: string;
  errors: string[];
  isValid: boolean;
}

function render(
  template: string,
  variables: Record<string, string | null>,
): RenderResult {
  const keys = Object.keys(variables);
  const errors: string[] = [];

  if (keys.length === 0) {
    return { value: template, errors, isValid: true };
  }

  let result = template;
  for (const key of keys) {
    const value = variables[key];
    if (!value) {
      errors.push(`\${${key}} has no value.`);
      continue;
    }
    const placeholder = `\${${key}}`;
    const replaced = result.replaceAll(placeholder, value);
    if (replaced === result) {
      errors.push(`\${${key}} not found in the template.`);
    }
    result = replaced;
  }

  return { value: result, errors, isValid: errors.length === 0 };
}

export { render };
export type { RenderResult };

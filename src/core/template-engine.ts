interface RenderResult {
  value: string;
  errors: string[];
  isValid: boolean;
}

function interpolate(
  template: string,
  variables: Record<string, string>,
): { result: string; unusedKeys: string[] } {
  const unusedKeys: string[] = [];
  let result = template;

  for (const key of Object.keys(variables)) {
    const placeholder = `\${${key}}`;
    const replaced = result.replaceAll(placeholder, variables[key]);
    if (replaced === result) {
      unusedKeys.push(key);
    }
    result = replaced;
  }

  return { result, unusedKeys };
}

function findUnreplacedPlaceholders(text: string): string[] {
  const placeholderPattern = /\$\{(\w+)\}/g;
  return [...text.matchAll(placeholderPattern)].map(
    (match) => `Unreplaced placeholder \${${match[1]}} in template.`,
  );
}

function render(
  template: string,
  variables: Record<string, string>,
): RenderResult {
  const { result, unusedKeys } = interpolate(template, variables);

  const errors = [
    ...unusedKeys.map((key) => `\${${key}} not found in the template.`),
    ...findUnreplacedPlaceholders(result),
  ];

  return { value: result, errors, isValid: errors.length === 0 };
}

export { render };
export type { RenderResult };

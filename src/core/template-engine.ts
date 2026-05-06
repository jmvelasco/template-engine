interface RenderResult {
  value: string;
  errors: string[];
  isValid: boolean;
}

function interpolate(
  template: string,
  variables: Record<string, string>,
): { result: string; unusedKeys: string[]; unresolvedPlaceholders: string[] } {
  const unusedKeys: string[] = [];
  const resolvedKeys = new Set<string>();
  let result = template;

  for (const key of Object.keys(variables)) {
    const placeholder = `\${${key}}`;
    const replaced = result.replaceAll(placeholder, variables[key]);
    if (replaced === result) {
      unusedKeys.push(key);
    } else {
      resolvedKeys.add(key);
    }
    result = replaced;
  }

  const placeholderPattern = /\$\{(\w+)\}/g;
  const unresolvedPlaceholders = [...template.matchAll(placeholderPattern)]
    .filter((match) => !resolvedKeys.has(match[1]))
    .map((match) => `Unreplaced placeholder \${${match[1]}} in template.`);

  return { result, unusedKeys, unresolvedPlaceholders };
}

function render(
  template: string,
  variables: Record<string, string>,
): RenderResult {
  const { result, unusedKeys, unresolvedPlaceholders } = interpolate(
    template,
    variables,
  );

  const errors = [
    ...unusedKeys.map((key) => `\${${key}} not found in the template.`),
    ...unresolvedPlaceholders,
  ];

  return { value: result, errors, isValid: errors.length === 0 };
}

export { render };
export type { RenderResult };

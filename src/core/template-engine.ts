interface RenderResult {
  value: string;
  errors: string[];
  isValid: boolean;
}

function interpolate(
  template: string,
  variables: Record<string, string | undefined>,
): {
  result: string;
  unusedKeys: string[];
  undefinedKeys: string[];
  unresolvedPlaceholders: string[];
} {
  const unusedKeys: string[] = [];
  const undefinedKeys: string[] = [];
  const resolvedKeys = new Set<string>();
  let result = template;

  for (const key of Object.keys(variables)) {
    if (variables[key] === undefined) {
      undefinedKeys.push(key);
      continue; // Skip undefined values
    }
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

  return { result, unusedKeys, undefinedKeys, unresolvedPlaceholders };
}

function render(
  template: string,
  variables: Record<string, string | undefined>,
): RenderResult {
  const { result, unusedKeys, undefinedKeys, unresolvedPlaceholders } =
    interpolate(template, variables);

  const errors = [
    ...unusedKeys.map((key) => `\${${key}} not found in the template.`),
    ...undefinedKeys.map((key) => `\${${key}} is undefined.`),
    ...unresolvedPlaceholders,
  ];

  return { value: result, errors, isValid: errors.length === 0 };
}

export { render };
export type { RenderResult };

import { ParseNotifier } from "./ports/parse-notifier";

function parse(
  template: string,
  variables: Record<string, string | null>,
  notifier?: ParseNotifier,
): string {
  let parsedTemplate = template;

  const matches = [...template.matchAll(/\$\{([^}]+)\}/g)];
  const placeholdersInTemplate = new Set(matches.map(m => m[1]));

  for (const placeholderName of placeholdersInTemplate) {
    if (!(placeholderName in variables)) {
      notifier?.notify({
        type: "WARNING",
        message: `No replacements done! placeholder \${${placeholderName}} is not defined in the dictionary.`,
      });
    }
  }

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `\${${key}}`;
    const existsInTemplate = parsedTemplate.includes(placeholder);

    if (value === null) {
      if (existsInTemplate) {
        notifier?.notify({
          type: "WARNING",
          message: `No replacements done! key \${${key}} has no value.`,
        });
      }
    } else {
      if (existsInTemplate) {
        parsedTemplate = parsedTemplate.replaceAll(placeholder, value);
        notifier?.notify({
          type: "SUCCESS",
          message: `Replaced \${${key}} with '${value}'`,
        });
      } else {
        notifier?.notify({
          type: "WARNING",
          message: `No replacements done! key \${${key}} not found in the template.`,
        });
      }
    }
  }

  return parsedTemplate;
}

export { parse };

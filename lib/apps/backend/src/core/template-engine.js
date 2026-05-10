"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
exports.logger = logger;
function logger(message) {
    process.stdout.write(message + "\n");
}
function render(template, variables) {
    const key = Object.keys(variables).pop();
    const value = Object.values(variables).pop();
    if (!key) {
        logger(`No replacements done! key not found in the dictionary.`);
        return template;
    }
    if (!value) {
        logger(`No replacements done! key \${${key}} has no value.`);
        return template;
    }
    const placeholder = `\${${key}}`;
    const parsedTemplate = template.replaceAll(placeholder, value);
    delete variables[key];
    if (parsedTemplate === template) {
        logger(`No replacements done! key \${${key}} not found in the template.`);
    }
    return render(parsedTemplate, variables);
}
//# sourceMappingURL=template-engine.js.map
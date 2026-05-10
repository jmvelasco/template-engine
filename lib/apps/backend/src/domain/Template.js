"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
const ParsingNotifier_1 = require("./ParsingNotifier");
class Template {
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new Template(value);
    }
    render(variables) {
        const notifier = new ParsingNotifier_1.ParsingNotifier();
        const keysInTemplate = this.extractKeys();
        this.checkUnusedVariables(keysInTemplate, variables, notifier);
        if (keysInTemplate.length === 0) {
            return {
                renderedText: this.value,
                status: "SUCCESS",
                notifications: notifier.getNotifications(),
            };
        }
        const { renderedText, resolvedCount, unresolvedCount } = this.processKeys(keysInTemplate, variables, notifier);
        const status = this.determineStatus(resolvedCount, unresolvedCount);
        return {
            renderedText,
            status,
            notifications: notifier.getNotifications(),
        };
    }
    extractKeys() {
        const regex = /\${([^}]+)}/g;
        let match;
        const matches = [];
        while ((match = regex.exec(this.value)) !== null) {
            matches.push(match[1]);
        }
        return Array.from(new Set(matches));
    }
    checkUnusedVariables(keysInTemplate, variables, notifier) {
        for (const key of Object.keys(variables)) {
            if (!keysInTemplate.includes(key)) {
                notifier.notify("WARNING", `Variable '${key}' is defined in the dictionary but was not used in the template.`, "UNUSED_VARIABLE", { key });
            }
        }
    }
    processKeys(keysInTemplate, variables, notifier) {
        let renderedText = this.value;
        let resolvedCount = 0;
        let unresolvedCount = 0;
        for (const key of keysInTemplate) {
            const value = variables[key];
            if (value === undefined) {
                unresolvedCount++;
                notifier.notify("WARNING", `Variable '${key}' is required but was not provided in the dictionary.`, "MISSING_VARIABLE", { key });
            }
            else if (value === null) {
                unresolvedCount++;
                notifier.notify("WARNING", `Variable '${key}' has a null value.`, "NULL_VARIABLE_VALUE", { key });
            }
            else {
                resolvedCount++;
                renderedText = renderedText.replaceAll(`\${${key}}`, value);
            }
        }
        return { renderedText, resolvedCount, unresolvedCount };
    }
    determineStatus(resolvedCount, unresolvedCount) {
        if (resolvedCount === 0) {
            return "FAILED";
        }
        if (unresolvedCount > 0) {
            return "PARTIAL";
        }
        return "SUCCESS";
    }
}
exports.Template = Template;
//# sourceMappingURL=Template.js.map
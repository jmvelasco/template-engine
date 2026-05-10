"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTemplateUseCase = void 0;
const Template_1 = require("../domain/Template");
class ParseTemplateUseCase {
    execute(command) {
        const template = Template_1.Template.create(command.templateContent);
        return template.render(command.variables);
    }
}
exports.ParseTemplateUseCase = ParseTemplateUseCase;
//# sourceMappingURL=ParseTemplateUseCase.js.map
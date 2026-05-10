import { Template } from "../domain/Template";
import { ParsingResult } from "../domain/types";

export interface ParseTemplateCommand {
  templateContent: string;
  variables: Record<string, string | null>;
}

export class ParseTemplateUseCase {
  execute(command: ParseTemplateCommand): ParsingResult {
    const template = Template.create(command.templateContent);
    return template.render(command.variables);
  }
}

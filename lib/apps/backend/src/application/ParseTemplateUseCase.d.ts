import { ParsingResult } from "../domain/types";
export interface ParseTemplateCommand {
    templateContent: string;
    variables: Record<string, string | null>;
}
export declare class ParseTemplateUseCase {
    execute(command: ParseTemplateCommand): ParsingResult;
}
//# sourceMappingURL=ParseTemplateUseCase.d.ts.map
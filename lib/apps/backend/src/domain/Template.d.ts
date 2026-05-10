import { ParsingResult } from "./types";
export declare class Template {
    readonly value: string;
    private constructor();
    static create(value: string): Template;
    render(variables: Record<string, string | null>): ParsingResult;
    private extractKeys;
    private checkUnusedVariables;
    private processKeys;
    private determineStatus;
}
//# sourceMappingURL=Template.d.ts.map
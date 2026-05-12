import { TemplateParserPort, ParseResult } from "../../domain/ports/template-parser.port";

export class ParseTemplateUseCase {
  constructor(private readonly parserPort: TemplateParserPort) {}

  public async execute(
    template: string,
    variables: Record<string, string | null>,
  ): Promise<ParseResult> {
    return this.parserPort.parse(template, variables);
  }
}

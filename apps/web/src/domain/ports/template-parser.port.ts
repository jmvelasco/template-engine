import { ParseEvent } from "../models/parse-event";

export interface ParseResult {
  parsedText: string;
  events: ParseEvent[];
}

export interface TemplateParserPort {
  parse(
    template: string,
    variables: Record<string, string | null>,
  ): Promise<ParseResult>;
}

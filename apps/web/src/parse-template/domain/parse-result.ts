interface ParseNotification {
  type: "replaced" | "missing-variable" | "null-value" | "unused-variable";
  key: string;
  value?: string;
  occurrences?: number;
}

interface ParseResult {
  text: string;
  notifications: ParseNotification[];
}

export type { ParseResult, ParseNotification };

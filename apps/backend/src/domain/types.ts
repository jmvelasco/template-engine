export type ParsingStatus = "SUCCESS" | "PARTIAL" | "FAILED";
export type NotificationType = "INFO" | "WARNING" | "ERROR";

export interface ParsingNotification {
  type: NotificationType;
  message: string;
  code: "UNUSED_VARIABLE" | "NULL_VARIABLE_VALUE" | "MISSING_VARIABLE";
  details?: Record<string, string>;
}

export interface ParsingResult {
  renderedText: string;
  notifications: ParsingNotification[];
  status: ParsingStatus;
}

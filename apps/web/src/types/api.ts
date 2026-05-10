export type ParsingStatus = "SUCCESS" | "PARTIAL" | "FAILED";

export type NotificationType = "INFO" | "WARNING" | "ERROR";

export interface ParsingNotification {
  type: NotificationType;
  message: string;
  code: string;
  details?: Record<string, string>;
}

export interface ParsingResult {
  renderedText: string;
  status: ParsingStatus;
  notifications: ParsingNotification[];
}

export type NotificationType = "success" | "warning" | "error" | "info";

export type ParseStatus = "success" | "partial" | "warning";

export interface Notification {
  type: NotificationType;
  message: string;
}

export interface ParseRequest {
  template: string;
  variables: Record<string, string | null>;
}

export interface ParseResponse {
  text: string;
  status: ParseStatus;
  notifications: Notification[];
}

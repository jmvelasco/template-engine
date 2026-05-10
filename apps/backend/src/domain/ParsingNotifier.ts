import { ParsingNotification, NotificationType } from "./types";

export class ParsingNotifier {
  private readonly notificationsList: ParsingNotification[] = [];

  notify(
    type: NotificationType,
    message: string,
    code: "UNUSED_VARIABLE" | "NULL_VARIABLE_VALUE" | "MISSING_VARIABLE",
    details?: Record<string, string>,
  ): void {
    this.notificationsList.push({ type, message, code, details });
  }

  getNotifications(): ParsingNotification[] {
    return [...this.notificationsList];
  }
}

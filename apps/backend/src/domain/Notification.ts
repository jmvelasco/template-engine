import type { NotificationType } from "@template-engine/api-types";

export class Notification {
  private constructor(
    readonly type: NotificationType,
    readonly message: string,
  ) {}

  static success(message: string): Notification {
    return new Notification("success", message);
  }

  static warning(message: string): Notification {
    return new Notification("warning", message);
  }

  static error(message: string): Notification {
    return new Notification("error", message);
  }

  static info(message: string): Notification {
    return new Notification("info", message);
  }
}

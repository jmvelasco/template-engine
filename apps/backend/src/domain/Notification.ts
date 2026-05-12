import type { NotificationType } from "@template-engine/api-types";

export class Notification {
  private constructor(
    readonly type: NotificationType,
    readonly message: string,
  ) {}

  static success(_message: string): Notification {
    return undefined as unknown as Notification;
  }

  static warning(_message: string): Notification {
    return undefined as unknown as Notification;
  }

  static error(_message: string): Notification {
    return undefined as unknown as Notification;
  }

  static info(_message: string): Notification {
    return undefined as unknown as Notification;
  }
}

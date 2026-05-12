import { Notification } from "./Notification";

export class Notifier {
  private constructor(private readonly items: Notification[]) {}

  static create(): Notifier {
    return new Notifier([]);
  }

  addSuccess(message: string): Notifier {
    return new Notifier([...this.items, Notification.success(message)]);
  }

  addWarning(message: string): Notifier {
    return new Notifier([...this.items, Notification.warning(message)]);
  }

  addError(message: string): Notifier {
    return new Notifier([...this.items, Notification.error(message)]);
  }

  addInfo(message: string): Notifier {
    return new Notifier([...this.items, Notification.info(message)]);
  }

  notifications(): Notification[] {
    return [...this.items];
  }
}

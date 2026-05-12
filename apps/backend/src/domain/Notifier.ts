import { Notification } from "./Notification";

export class Notifier {
  private constructor(private readonly items: Notification[]) {}

  static create(): Notifier {
    return undefined as unknown as Notifier;
  }

  addSuccess(_message: string): Notifier {
    return undefined as unknown as Notifier;
  }

  addWarning(_message: string): Notifier {
    return undefined as unknown as Notifier;
  }

  addError(_message: string): Notifier {
    return undefined as unknown as Notifier;
  }

  addInfo(_message: string): Notifier {
    return undefined as unknown as Notifier;
  }

  notifications(): Notification[] {
    return [];
  }
}

import { ParseNotifier, ParseEvent } from "../../domain/ports/parse-notifier";

export class InMemoryParseNotifier implements ParseNotifier {
  private readonly events: ParseEvent[] = [];

  public notify(event: ParseEvent): void {
    this.events.push(event);
  }

  public getEvents(): ParseEvent[] {
    return this.events;
  }
}

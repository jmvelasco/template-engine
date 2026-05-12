export interface ParseEvent {
  type: "SUCCESS" | "WARNING";
  message: string;
}

export interface ParseNotifier {
  notify(event: ParseEvent): void;
}

import { ParsingNotification, NotificationType } from "./types";
export declare class ParsingNotifier {
    private readonly notificationsList;
    notify(type: NotificationType, message: string, code: "UNUSED_VARIABLE" | "NULL_VARIABLE_VALUE" | "MISSING_VARIABLE", details?: Record<string, string>): void;
    getNotifications(): ParsingNotification[];
}
//# sourceMappingURL=ParsingNotifier.d.ts.map
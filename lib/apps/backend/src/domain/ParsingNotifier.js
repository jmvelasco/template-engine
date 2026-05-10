"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingNotifier = void 0;
class ParsingNotifier {
    constructor() {
        this.notificationsList = [];
    }
    notify(type, message, code, details) {
        this.notificationsList.push({ type, message, code, details });
    }
    getNotifications() {
        return [...this.notificationsList];
    }
}
exports.ParsingNotifier = ParsingNotifier;
//# sourceMappingURL=ParsingNotifier.js.map
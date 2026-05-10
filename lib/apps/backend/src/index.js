"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParseTemplateUseCase_1 = require("./application/ParseTemplateUseCase");
const createServer_1 = require("./infrastructure/http/createServer");
const port = process.env.PORT || 3001;
const parseTemplateUseCase = new ParseTemplateUseCase_1.ParseTemplateUseCase();
const app = (0, createServer_1.createServer)(parseTemplateUseCase);
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server]: Template engine backend is running on port ${port}`);
});
//# sourceMappingURL=index.js.map
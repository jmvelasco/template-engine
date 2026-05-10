import { ParseTemplateUseCase } from "./application/ParseTemplateUseCase";
import { createServer } from "./infrastructure/http/createServer";

const port = process.env.PORT || 3001;

const parseTemplateUseCase = new ParseTemplateUseCase();
const app = createServer(parseTemplateUseCase);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server]: Template engine backend is running on port ${port}`);
});

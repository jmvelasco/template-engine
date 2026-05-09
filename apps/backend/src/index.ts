import { createApp } from "./parse-template/infrastructure/app";

const PORT = process.env.PORT ?? 3000;
const app = createApp();

app.listen(PORT, () => {
  process.stdout.write(`Server running on port ${PORT}\n`);
});

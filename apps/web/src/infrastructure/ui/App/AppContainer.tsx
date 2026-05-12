import { createTemplateEngine } from "../../factory";
import { App } from "./App";

export function AppContainer() {
  const templateEngine = createTemplateEngine();
  return <App templateEngine={templateEngine} />;
}

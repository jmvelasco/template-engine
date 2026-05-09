import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TemplateWiredPage } from "./parse-template/ui/TemplateWiredPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TemplateWiredPage />
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppContainer } from "./infrastructure/ui/App/AppContainer";
import "./globals.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <AppContainer />
    </StrictMode>,
  );
}

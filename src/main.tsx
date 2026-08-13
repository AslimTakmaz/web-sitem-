import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { defaultContent } from "./data/defaultContent";
import { ThemeProvider } from "./context/ThemeContext";
import { applyTheme, getCachedTheme } from "./lib/themeStorage";
import "./index.css";

applyTheme(getCachedTheme() ?? defaultContent.theme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);

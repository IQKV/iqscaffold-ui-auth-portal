import ReactDOM from "react-dom/client";
import { App } from "@/app";
import { initializeDefaultLocale } from "@/shared/locales";

// Initialize locale synchronously before rendering to prevent race conditions
initializeDefaultLocale();

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

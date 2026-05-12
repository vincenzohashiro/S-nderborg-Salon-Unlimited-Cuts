import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SiteConfigProvider } from "./context/SiteConfigContext.tsx";

createRoot(document.getElementById("root")!).render(
  <SiteConfigProvider>
    <App />
  </SiteConfigProvider>
);

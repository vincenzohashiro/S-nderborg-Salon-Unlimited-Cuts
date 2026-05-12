import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteConfig } from "@/types/site-config";
import { defaultConfig } from "@/config/defaultConfig";

const SiteConfigContext = createContext<SiteConfig>(defaultConfig);

const isPreviewMode = () => new URLSearchParams(window.location.search).has("preview");

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    if (isPreviewMode()) {
      // In preview mode: receive config from Settings panel via postMessage
      const handler = (e: MessageEvent) => {
        if (e.data?.type === "ab-config-update" && e.data.config) {
          setConfig(e.data.config);
        }
      };
      window.addEventListener("message", handler);
      // Signal to parent that this iframe is ready to receive config
      window.parent.postMessage({ type: "ab-preview-ready" }, "*");
      return () => window.removeEventListener("message", handler);
    } else {
      // Normal mode: fetch from site-config.json
      fetch(`${import.meta.env.BASE_URL}site-config.json`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data: SiteConfig) => setConfig(data))
        .catch(() => {});
    }
  }, []);

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);

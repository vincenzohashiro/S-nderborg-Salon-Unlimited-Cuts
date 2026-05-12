import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteConfig } from "@/types/site-config";
import { defaultConfig } from "@/config/defaultConfig";

const SiteConfigContext = createContext<SiteConfig>(defaultConfig);

const isPreviewMode = () =>
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("preview");

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    if (isPreviewMode()) {
      // Preview mode: read from localStorage (written by Settings panel)
      const stored = localStorage.getItem("ab_preview_config");
      if (stored) {
        try { setConfig(JSON.parse(stored) as SiteConfig); } catch {}
      }

      // Listen for real-time updates — storage event fires in iframe when
      // the parent (Settings page) writes to localStorage
      const handler = (e: StorageEvent) => {
        if (e.key === "ab_preview_config" && e.newValue) {
          try { setConfig(JSON.parse(e.newValue) as SiteConfig); } catch {}
        }
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    } else {
      // Normal mode: fetch from published site-config.json
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

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteConfig } from "@/types/site-config";
import { defaultConfig } from "@/config/defaultConfig";

const SiteConfigContext = createContext<SiteConfig>(defaultConfig);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}site-config.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: SiteConfig) => setConfig(data))
      .catch(() => {});
  }, []);

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteConfig } from "@/types/site-config";
import { defaultConfig } from "@/config/defaultConfig";

const SiteConfigContext = createContext<SiteConfig>(defaultConfig);

const isPreviewMode = () =>
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("preview");

// Merge any external data (fetch / localStorage) with defaultConfig so that
// missing fields from old cached data never crash the components.
export const mergeConfig = (data: unknown): SiteConfig => {
  const d = (data ?? {}) as Partial<SiteConfig>;
  return {
    ...defaultConfig,
    ...d,
    general:        { ...defaultConfig.general,        ...(d.general        ?? {}) },
    hero:           { ...defaultConfig.hero,           ...(d.hero           ?? {}) },
    about:          { ...defaultConfig.about,          ...(d.about          ?? {}) },
    offer:          { ...defaultConfig.offer,          ...(d.offer          ?? {}) },
    servicesSection:{ ...defaultConfig.servicesSection,...(d.servicesSection ?? {}) },
    gallery:        { ...defaultConfig.gallery,        ...(d.gallery        ?? {}) },
    contact:        { ...defaultConfig.contact,        ...(d.contact        ?? {}) },
    pages: {
      services: { ...defaultConfig.pages.services, ...(d.pages?.services ?? {}) },
      booking:  { ...defaultConfig.pages.booking,  ...(d.pages?.booking  ?? {}) },
    },
    seo: {
      ...defaultConfig.seo,
      ...(d.seo ?? {}),
      home:     { ...defaultConfig.seo.home,     ...(d.seo?.home     ?? {}) },
      services: { ...defaultConfig.seo.services, ...(d.seo?.services ?? {}) },
      booking:  { ...defaultConfig.seo.booking,  ...(d.seo?.booking  ?? {}) },
    },
    services:    d.services    ?? defaultConfig.services,
    memberships: d.memberships ?? defaultConfig.memberships,
    reviews:     d.reviews     ?? defaultConfig.reviews,
  };
};

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    if (isPreviewMode()) {
      // Preview mode: read config from localStorage (written by Settings panel)
      const stored = localStorage.getItem("ab_preview_config");
      if (stored) {
        try { setConfig(mergeConfig(JSON.parse(stored))); } catch {}
      }

      // Update in real-time when Settings panel writes a new config
      const handler = (e: StorageEvent) => {
        if (e.key === "ab_preview_config" && e.newValue) {
          try { setConfig(mergeConfig(JSON.parse(e.newValue))); } catch {}
        }
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    } else {
      // Normal mode: fetch published config, merge with defaults
      fetch(`${import.meta.env.BASE_URL}site-config.json`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => setConfig(mergeConfig(data)))
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

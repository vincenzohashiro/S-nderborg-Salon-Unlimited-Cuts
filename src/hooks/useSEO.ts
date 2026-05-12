import { useEffect } from "react";

const setMeta = (name: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setOg = (prop: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export const useSEO = (title: string, description: string, ogImage?: string) => {
  useEffect(() => {
    document.title = title;
    setMeta("description", description);
    setOg("og:title", title);
    setOg("og:description", description);
    if (ogImage) setOg("og:image", ogImage);
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);
  }, [title, description, ogImage]);
};

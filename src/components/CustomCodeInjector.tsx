import { useEffect } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";

function injectHtml(html: string, target: HTMLElement): Element[] {
  if (!html.trim()) return [];
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const injected: Element[] = [];
  Array.from(tmp.children).forEach((node) => {
    if (node.tagName === "SCRIPT") {
      const s = document.createElement("script");
      Array.from(node.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.textContent = node.textContent;
      target.appendChild(s);
      injected.push(s);
    } else {
      const clone = node.cloneNode(true) as Element;
      target.appendChild(clone);
      injected.push(clone);
    }
  });
  return injected;
}

const CustomCodeInjector = () => {
  const { customCode } = useSiteConfig();

  useEffect(() => {
    const nodes = injectHtml(customCode.head, document.head);
    return () => nodes.forEach((n) => n.remove());
  }, [customCode.head]);

  useEffect(() => {
    const nodes = injectHtml(customCode.footer, document.body);
    return () => nodes.forEach((n) => n.remove());
  }, [customCode.footer]);

  return null;
};

export default CustomCodeInjector;

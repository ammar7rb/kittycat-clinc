import { useEffect } from "react";
import { useSettings } from "@/lib/queries";

/**
 * Applies dynamic head settings on the client:
 * - Favicon URL from settings.favicon_url (falls back to logo_url)
 * - Apple touch icon
 */
export function SiteHeadEffects() {
  const { data: settings } = useSettings();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const icon = settings?.favicon_url || settings?.logo_url;
    if (!icon) return;

    const setLink = (rel: string, type?: string) => {
      let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      if (type) link.type = type;
      link.href = icon;
    };

    setLink("icon");
    setLink("shortcut icon");
    setLink("apple-touch-icon");
  }, [settings?.favicon_url, settings?.logo_url]);

  return null;
}

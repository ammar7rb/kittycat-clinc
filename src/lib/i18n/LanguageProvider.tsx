import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { translations, type Language, type TranslationKey } from "./translations";
import { supabase } from "@/integrations/supabase/client";

interface LanguageContextValue {
  lang: Language;
  dir: "rtl" | "ltr";
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "kcc-lang";
const DEFAULT_LANG: Language = "ar";

type OverrideMap = { ar: Record<string, string>; en: Record<string, string> };

function useContentOverrides() {
  return useQuery({
    queryKey: ["content", "overrides"],
    staleTime: 60_000,
    queryFn: async (): Promise<OverrideMap> => {
      const out: OverrideMap = { ar: {}, en: {} };
      const { data, error } = await supabase
        .from("website_content")
        .select("key, value_ar, value_en");
      if (error) return out;
      for (const row of data ?? []) {
        if (row.value_ar) out.ar[row.key] = row.value_ar;
        if (row.value_en) out.en[row.key] = row.value_en;
      }
      return out;
    },
  });
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANG);
  const { data: overrides } = useContentOverrides();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === "ar" || stored === "en") setLangState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, [lang]);

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  const t = useMemo(() => {
    return (key: TranslationKey): string => {
      const override = overrides?.[lang]?.[key as string];
      if (override) return override;
      return translations[lang][key] ?? key;
    };
  }, [lang, overrides]);

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

/**
 * Helper to pick the localized field (e.g. name_ar vs name_en) from a DB row.
 */
export function useLocalized() {
  const { lang } = useLanguage();
  return function pick<T extends Record<string, unknown>>(
    row: T,
    base: string,
  ): string {
    const key = `${base}_${lang}` as keyof T;
    return (row[key] as string) ?? (row[`${base}_ar` as keyof T] as string) ?? "";
  };
}

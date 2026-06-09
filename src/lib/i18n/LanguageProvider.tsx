import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "./translations";

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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANG);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === "ar" || stored === "en") {
        setLangState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Sync <html lang> and dir
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

  const t = (key: TranslationKey): string => translations[lang][key] ?? key;

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

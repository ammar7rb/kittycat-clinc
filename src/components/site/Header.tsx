import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Globe, MessageCircle, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useBranches, useSettings } from "@/lib/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import brandIconAsset from "@/assets/kitty-icon.png.asset.json";

export function Header() {
  const { t, toggleLang, lang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const { data: branches } = useBranches();
  const { data: settings } = useSettings();
  const waNumber = settings?.whatsapp || branches?.[0]?.whatsapp || "";
  const iconUrl = settings?.logo_url || brandIconAsset.url;


  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/shop", label: t("nav.shop") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-[68px] items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={t("brand.name")}>
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/30 p-1.5 shrink-0">
            <img
              src={iconUrl}
              alt={t("brand.name")}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-lg font-extrabold text-foreground whitespace-nowrap">
              Kitty Cat Clinic
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-foreground/70 whitespace-nowrap">
              عيادة قطتي الصغيرة
            </span>
          </div>
        </Link>



        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
              activeProps={{ className: "text-primary bg-accent" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
            title={theme === "dark" ? "Light" : "Dark"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="hidden sm:inline-flex"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4 me-1" />
            {t("lang.toggle")}
          </Button>

          {waNumber && (
            <Button
              asChild
              size="sm"
              className="hidden md:inline-flex bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-95"
            >
              <a
                href={buildWhatsAppUrl(waNumber, lang === "ar"
                  ? "السلام عليكم، أود الحجز في Kitty Cat Clinic"
                  : "Hello, I'd like to book at Kitty Cat Clinic")}
                target="_blank"
                rel="noopener"
              >
                <MessageCircle className="h-4 w-4 me-1" />
                {t("nav.bookWhatsapp")}
              </a>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "right" : "left"} className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-primary"
                    activeProps={{ className: "text-primary bg-accent" }}
                  >
                    {n.label}
                  </Link>
                ))}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    toggleLang();
                    setOpen(false);
                  }}
                >
                  <Globe className="h-4 w-4 me-1" />
                  {t("lang.toggle")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

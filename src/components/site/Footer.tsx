import { Link } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { useBranches } from "@/lib/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const { t } = useLanguage();
  const pick = useLocalized();
  const { data: branches } = useBranches();

  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              <span className="text-lg font-extrabold">K</span>
            </div>
            <div>
              <div className="text-sm font-extrabold">{t("brand.name")}</div>
              <div className="text-xs text-muted-foreground">{t("brand.tagline")}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-sm">
            {t("home.hero.subtitle")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground">{t("footer.quickLinks")}</h3>
          <ul className="mt-4 space-y-2">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground">{t("footer.branches")}</h3>
          <ul className="mt-4 space-y-3">
            {branches?.map((b) => (
              <li key={b.id} className="text-sm">
                <div className="flex items-start gap-2 text-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <div className="font-semibold">{pick(b, "name")}</div>
                    {b.phone && (
                      <a
                        href={`tel:${b.phone}`}
                        className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        <Phone className="h-3 w-3" /> {b.phone}
                      </a>
                    )}
                    {b.whatsapp && (
                      <a
                        href={buildWhatsAppUrl(b.whatsapp)}
                        target="_blank"
                        rel="noopener"
                        className="ms-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("brand.name")} — {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Music2,
  Ghost,
} from "lucide-react";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { useBranches, useSettings } from "@/lib/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const { t, lang } = useLanguage();
  const pick = useLocalized();
  const { data: branches } = useBranches();
  const { data: settings } = useSettings();

  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  const socials = [
    { url: settings?.facebook, Icon: Facebook, label: "Facebook" },
    { url: settings?.instagram, Icon: Instagram, label: "Instagram" },
    { url: settings?.tiktok, Icon: Music2, label: "TikTok" },
    { url: settings?.youtube, Icon: Youtube, label: "YouTube" },
    { url: settings?.twitter, Icon: Twitter, label: "X" },
  ].filter((s) => !!s.url);

  const address = lang === "ar" ? settings?.address_ar : settings?.address_en;

  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={t("brand.name")}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                <span className="text-lg font-extrabold">K</span>
              </div>
            )}
            <div>
              <div className="text-sm font-extrabold">{t("brand.name")}</div>
              <div className="text-xs text-muted-foreground">{t("brand.tagline")}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-sm">
            {t("home.hero.subtitle")}
          </p>

          {/* Contact summary */}
          <div className="mt-5 space-y-2 text-sm">
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
            )}
            {settings?.whatsapp && (
              <a
                href={buildWhatsAppUrl(settings.whatsapp)}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" /> {settings.whatsapp}
              </a>
            )}
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" /> {settings.email}
              </a>
            )}
            {address && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="whitespace-pre-line">{address}</span>
              </div>
            )}
          </div>

          {/* Socials */}
          {socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
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

import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, MapPin, ExternalLink, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FollowUs } from "@/components/site/FollowUs";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { useBranches } from "@/lib/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا — Kitty Cat Clinic | الرغامة، السنابل، الرحاب" },
      {
        name: "description",
        content:
          "اختر الفرع الأقرب وتواصل معنا مباشرة عبر واتساب أو الاتصال — Kitty Cat Clinic بثلاثة فروع في جدة.",
      },
      { property: "og:title", content: "تواصل مع Kitty Cat Clinic" },
      {
        property: "og:description",
        content: "ثلاثة فروع في جدة — تواصل واتساب مباشر مع الفرع الأقرب لك.",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLanguage();
  const pick = useLocalized();
  const { data: branches } = useBranches();

  return (
    <SiteLayout>
      <PageHero
        badge={
          <>
            <Sparkles className="h-3.5 w-3.5" />
            {t("contact.badge")}
          </>
        }
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      />

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl rounded-2xl border border-secondary/30 bg-secondary/10 px-5 py-4 text-center text-sm font-medium text-foreground">
          <MessageCircle className="inline h-4 w-4 me-2 text-secondary" />
          {t("contact.preferWhatsapp")}
        </div>

        {(!branches || branches.length === 0) && (
          <div className="text-center text-muted-foreground">{t("common.loading")}</div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches?.map((b, i) => {
            const isOrange = i % 2 === 1;
            const gradient = isOrange
              ? "var(--gradient-secondary)"
              : "var(--gradient-primary)";
            const accent = isOrange ? "var(--secondary)" : "var(--primary)";

            return (
              <article
                key={b.id}
                data-reveal-delay={i * 110}
                className="reveal reveal-up group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-elegant)]"
              >
                {/* Top gradient strip */}
                <div aria-hidden className="h-1.5" style={{ background: gradient }} />

                {/* Header */}
                <div className="flex items-start gap-4 p-6 pb-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-soft)] transition-transform duration-500 group-hover:scale-110"
                    style={{ background: gradient }}
                  >
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-extrabold leading-tight text-foreground">
                      {pick(b, "name")}
                    </h2>
                    {pick(b, "address") && (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {pick(b, "address")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-border" />

                {/* Contact rows */}
                <div className="space-y-2 p-6 pt-4">
                  {b.phone && (
                    <a
                      href={`tel:${b.phone}`}
                      className="flex items-center gap-3 rounded-xl border border-transparent bg-background/40 p-3 transition-all hover:border-border hover:bg-background"
                    >
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                          background: `color-mix(in oklab, ${accent} 12%, transparent)`,
                          color: accent,
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("contact.phone")}
                        </span>
                        <span dir="ltr" className="text-sm font-bold text-foreground">
                          {b.phone}
                        </span>
                      </span>
                    </a>
                  )}
                  {b.whatsapp && (
                    <a
                      href={buildWhatsAppUrl(b.whatsapp, t("wa.defaultMsg"))}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 rounded-xl border border-transparent bg-background/40 p-3 transition-all hover:border-[color:var(--whatsapp)]/40 hover:bg-background"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--whatsapp)]/12 text-[color:var(--whatsapp)]">
                        <MessageCircle className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("contact.whatsapp")}
                        </span>
                        <span dir="ltr" className="text-sm font-bold text-foreground">
                          +{b.whatsapp}
                        </span>
                      </span>
                    </a>
                  )}
                  {b.maps_url && (
                    <a
                      href={b.maps_url}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 rounded-xl border border-transparent bg-background/40 p-3 transition-all hover:border-border hover:bg-background"
                    >
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                          background: `color-mix(in oklab, ${accent} 12%, transparent)`,
                          color: accent,
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("common.location")}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {t("contact.openMaps")}
                        </span>
                      </span>
                    </a>
                  )}
                </div>

                {/* CTA footer */}
                {b.whatsapp && (
                  <div className="mt-auto p-6 pt-0">
                    <a
                      href={buildWhatsAppUrl(b.whatsapp, t("wa.defaultMsg"))}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold text-white shadow-[var(--shadow-soft)] transition-all hover:opacity-95 hover:shadow-[var(--shadow-elegant)]"
                      style={{ background: gradient }}
                    >
                      <MessageCircle className="h-5 w-5" />
                      {t("common.bookNow")}
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Follow us */}
        <div className="mt-16 md:mt-20">
          <FollowUs />
        </div>
      </section>
    </SiteLayout>
  );
}

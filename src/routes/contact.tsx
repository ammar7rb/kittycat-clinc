import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, MapPin, Clock, ExternalLink, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { useBranches } from "@/lib/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا — Kitty Cat Clinic | الرقام، الصنب، الرحبة" },
      {
        name: "description",
        content:
          "اختر الفرع الأقرب وتواصل معنا مباشرة عبر واتساب أو الاتصال — Kitty Cat Clinic بثلاثة فروع في الإمارات.",
      },
      { property: "og:title", content: "تواصل مع Kitty Cat Clinic" },
      {
        property: "og:description",
        content: "ثلاثة فروع — تواصل واتساب مباشر مع الفرع الأقرب لك.",
      },
    ],
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
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-secondary/30 bg-secondary/10 px-5 py-4 text-center text-sm font-medium text-foreground">
          <MessageCircle className="inline h-4 w-4 me-2 text-secondary" />
          {t("contact.preferWhatsapp")}
        </div>

        {(!branches || branches.length === 0) && (
          <div className="text-center text-muted-foreground">{t("common.loading")}</div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches?.map((b, i) => {
            const isOrange = i % 2 === 1;
            const mapsHref =
              b.maps_url ??
              (b.latitude && b.longitude
                ? `https://www.google.com/maps?q=${b.latitude},${b.longitude}`
                : null);

            return (
              <article
                key={b.id}
                className="relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6"
                style={{
                  borderColor: isOrange
                    ? "color-mix(in oklab, var(--secondary) 25%, var(--border))"
                    : "color-mix(in oklab, var(--primary) 25%, var(--border))",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1"
                  style={{
                    background: isOrange
                      ? "var(--gradient-secondary)"
                      : "var(--gradient-primary)",
                  }}
                />

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-[var(--shadow-soft)]"
                    style={{
                      background: isOrange
                        ? "var(--gradient-secondary)"
                        : "var(--gradient-primary)",
                    }}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{pick(b, "name")}</h2>
                </div>

                <dl className="mt-5 space-y-3 text-sm">
                  {pick(b, "address") && (
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-foreground">
                        {t("contact.address")}:
                      </dt>
                      <dd className="text-muted-foreground">{pick(b, "address")}</dd>
                    </div>
                  )}
                  {pick(b, "working_hours") && (
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-foreground">
                        <Clock className="inline h-4 w-4 me-1" />
                        {t("contact.hours")}:
                      </dt>
                      <dd className="text-muted-foreground">{pick(b, "working_hours")}</dd>
                    </div>
                  )}
                  {b.phone && (
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-foreground">
                        {t("contact.phone")}:
                      </dt>
                      <dd dir="ltr" className="text-muted-foreground">
                        <a href={`tel:${b.phone}`} className="hover:text-primary">
                          {b.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {b.whatsapp && (
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-foreground">
                        {t("contact.whatsapp")}:
                      </dt>
                      <dd dir="ltr" className="text-muted-foreground">{b.whatsapp}</dd>
                    </div>
                  )}
                </dl>

                {/* Map embed */}
                {b.maps_embed && (
                  <div className="mt-5 overflow-hidden rounded-xl border border-border">
                    <iframe
                      src={b.maps_embed}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${pick(b, "name")} map`}
                      className="h-44 w-full"
                    />
                  </div>
                )}

                <div className="mt-auto pt-6 flex flex-wrap gap-2">
                  {b.whatsapp && (
                    <Button
                      asChild
                      size="sm"
                      className="bg-[color:var(--whatsapp)] text-[color:var(--whatsapp-foreground)] hover:opacity-90"
                    >
                      <a
                        href={buildWhatsAppUrl(b.whatsapp, t("wa.defaultMsg"))}
                        target="_blank"
                        rel="noopener"
                      >
                        <MessageCircle className="h-4 w-4 me-1" />
                        {t("common.whatsapp")}
                      </a>
                    </Button>
                  )}
                  {b.phone && (
                    <Button asChild size="sm" variant="outline">
                      <a href={`tel:${b.phone}`}>
                        <Phone className="h-4 w-4 me-1" />
                        {t("common.call")}
                      </a>
                    </Button>
                  )}
                  {mapsHref && (
                    <Button asChild size="sm" variant="ghost">
                      <a href={mapsHref} target="_blank" rel="noopener">
                        <ExternalLink className="h-4 w-4 me-1" />
                        {t("contact.openMaps")}
                      </a>
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}

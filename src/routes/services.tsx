import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope, MessageCircle, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ServiceCard } from "@/components/site/ServiceCard";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useBranches, useServices } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "خدماتنا البيطرية المتخصصة للقطط | Kitty Cat Clinic" },
      {
        name: "description",
        content:
          "تعرف على خدمات Kitty Cat Clinic: فحوصات شاملة، تطعيمات، عناية بالأسنان، جراحة، أشعة، واستضافة فندقية مخصصة للقطط — في الرقام، الصنب، الرحبة.",
      },
      { property: "og:title", content: "خدماتنا — Kitty Cat Clinic" },
      {
        property: "og:description",
        content: "رعاية بيطرية متكاملة لكل مراحل حياة قطتك.",
      },
    ],
    links: [
      { rel: "canonical", href: "/services" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useLanguage();
  const { data: services } = useServices();
  const { data: branches } = useBranches();
  const firstWa = branches?.[0]?.whatsapp;

  return (
    <SiteLayout>
      <PageHero
        badge={
          <>
            <Sparkles className="h-3.5 w-3.5" />
            {t("services.badge")}
          </>
        }
        title={t("services.title")}
        subtitle={t("services.subtitle")}
      />

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services?.map((s, i) => (
            <ServiceCard
              key={s.id}
              service={s}
              tone={i % 2 === 0 ? "primary" : "secondary"}
              whatsapp={firstWa}
            />
          ))}
        </div>
      </section>

      {/* CTA band */}
      {firstWa && (
        <section
          className="relative overflow-hidden py-14"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--primary) 12%, var(--background)) 0%, color-mix(in oklab, var(--secondary) 12%, var(--background)) 100%)",
          }}
        >
          <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center md:flex-row md:justify-between md:text-start">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">
                <Stethoscope className="inline h-6 w-6 me-2 text-primary" />
                {t("services.cta.title")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("services.cta.subtitle")}</p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-secondary to-secondary-glow text-secondary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95"
            >
              <a
                href={buildWhatsAppUrl(firstWa, t("wa.defaultMsg"))}
                target="_blank"
                rel="noopener"
              >
                <MessageCircle className="h-5 w-5 me-2" />
                {t("nav.bookWhatsapp")}
              </a>
            </Button>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

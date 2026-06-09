import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Sparkles, Heart, ShieldCheck, MapPin, Phone, ArrowLeft, Cat } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { useBranches } from "@/lib/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kitty Cat Clinic — عيادة بيطرية متخصصة في القطط | الإمارات" },
      {
        name: "description",
        content:
          "أول عيادة بيطرية في الإمارات متخصصة حصريًا في القطط. خدمات طبية متكاملة، فريق خبير، ثلاثة فروع: الرقام، الصنب، الرحبة.",
      },
      { property: "og:title", content: "Kitty Cat Clinic" },
      {
        property: "og:description",
        content: "رعاية متخصصة لقطتك بكل حب واحتراف.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, lang } = useLanguage();
  const pick = useLocalized();
  const { data: branches } = useBranches();
  const firstWa = branches?.[0]?.whatsapp;

  const features = [
    { icon: Cat, key: "feature1" as const },
    { icon: Heart, key: "feature2" as const },
    { icon: ShieldCheck, key: "feature3" as const },
    { icon: MapPin, key: "feature4" as const },
  ];

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.4),transparent_60%)]" />

        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {t("brand.tagline")}
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              {t("home.hero.title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base/relaxed text-white/90 md:text-lg">
              {t("home.hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {firstWa && (
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-[var(--shadow-elegant)]"
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
              )}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                <a href="/services">
                  {t("common.learnMore")}
                  <ArrowLeft className={`h-4 w-4 ms-2 ${lang === "en" ? "rotate-180" : ""}`} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("home.why.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("home.why.subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity group-hover:opacity-100"
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">
                {t(`home.why.${key}.title` as const)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`home.why.${key}.desc` as const)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BRANCHES */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {t("home.branches.title")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("home.branches.subtitle")}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {branches?.map((b) => (
              <div
                key={b.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{pick(b, "name")}</h3>
                {pick(b, "address") && (
                  <p className="mt-2 text-sm text-muted-foreground">{pick(b, "address")}</p>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

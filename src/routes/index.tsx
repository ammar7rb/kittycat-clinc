import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Sparkles, Heart, ShieldCheck, MapPin, Phone, ArrowLeft, Cat, Gift, Stethoscope, Instagram, Music2, ChevronDown } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import { FeaturedOfferBanner } from "@/components/site/FeaturedOfferBanner";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { useBranches, useServices, useOffers, useSettings } from "@/lib/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kitty Cat Clinic — عيادة بيطرية متخصصة في القطط | السعودية" },
      {
        name: "description",
        content:
          "أول عيادة بيطرية في جدة متخصصة حصريًا في القطط. خدمات طبية متكاملة، فريق خبير، ثلاثة فروع: الرغامة، السنابل، الرحاب.",
      },
      { property: "og:title", content: "Kitty Cat Clinic" },
      { property: "og:description", content: "رعاية متخصصة لقطتك بكل حب واحتراف." },
    ],
    links: [
      { rel: "canonical", href: "/" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, lang } = useLanguage();
  const pick = useLocalized();
  const { data: branches } = useBranches();
  const { data: services } = useServices();
  const { data: offers } = useOffers();
  const { data: settings } = useSettings();
  const featuredOffer = offers?.[0];
  const firstWa = branches?.[0]?.whatsapp;
  const instagramUrl = settings?.instagram || "";
  const tiktokUrl = settings?.tiktok || "";
  const hasSocial = !!(instagramUrl || tiktokUrl);

  // Hero "Get to know us" modal
  const [introOpen, setIntroOpen] = useState(false);
  useEffect(() => {
    if (!introOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIntroOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [introOpen]);

  // Alternate icon palettes (teal / orange / teal / orange) for a balanced mix
  const features = [
    { icon: Cat, key: "feature1" as const, tone: "primary" as const },
    { icon: Heart, key: "feature2" as const, tone: "secondary" as const },
    { icon: ShieldCheck, key: "feature3" as const, tone: "primary" as const },
    { icon: MapPin, key: "feature4" as const, tone: "secondary" as const },
  ];

  return (
    <SiteLayout>
      {/* ============ HERO — teal base + orange spark ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.35),transparent_60%)]" />
        {/* warm orange glow accents */}
        <div className="pointer-events-none absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-secondary-glow/30 blur-3xl" />

        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="reveal reveal-blur mx-auto max-w-3xl text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/15 px-4 py-1.5 text-xs font-semibold text-secondary-glow backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {t("brand.tagline")}
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              <span className="block">{t("home.hero.titleLead")}</span>
              <span className="mt-2 block">{t("home.hero.titleAccent")}</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base/relaxed text-white/90 md:text-lg">
              {t("home.hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {hasSocial && (
                <div ref={introRef} className="relative">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => setIntroOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={introOpen}
                    className="bg-gradient-to-r from-secondary to-secondary-glow text-secondary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95"
                  >
                    <Sparkles className="h-5 w-5 me-2" />
                    {t("common.getToKnow")}
                    <ChevronDown className={`h-4 w-4 ms-2 transition-transform ${introOpen ? "rotate-180" : ""}`} />
                  </Button>

                  {introOpen && (
                    <div
                      role="menu"
                      className="absolute left-1/2 top-full z-30 mt-3 w-[260px] -translate-x-1/2 rounded-2xl border border-white/30 bg-white/15 p-3 shadow-[var(--shadow-elegant)] backdrop-blur-xl animate-in fade-in zoom-in-95"
                    >
                      <ul className="space-y-2">
                        {instagramUrl && (
                          <li>
                            <a
                              href={instagramUrl}
                              target="_blank"
                              rel="noopener"
                              onClick={() => setIntroOpen(false)}
                              className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-white"
                            >
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white">
                                <Instagram className="h-4 w-4" />
                              </span>
                              <span className="flex-1 text-start">{t("common.followOnInstagram")}</span>
                            </a>
                          </li>
                        )}
                        {tiktokUrl && (
                          <li>
                            <a
                              href={tiktokUrl}
                              target="_blank"
                              rel="noopener"
                              onClick={() => setIntroOpen(false)}
                              className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-white"
                            >
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                                <Music2 className="h-4 w-4" />
                              </span>
                              <span className="flex-1 text-start">{t("common.followOnTiktok")}</span>
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/50 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                <a href="#services">
                  {t("common.learnMore")}
                  <ArrowLeft className={`h-4 w-4 ms-2 ${lang === "en" ? "rotate-180" : ""}`} />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom blend strip — teal → cream */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background"
        />
      </section>

      {/* ============ FEATURED OFFER — single banner ============ */}
      {featuredOffer && (
        <section className="relative py-16 md:py-24">
          <div className="container mx-auto px-4">
            <SectionHeading
              badge={
                <>
                  <Gift className="h-3 w-3" />
                  {t("home.offers.title")}
                </>
              }
              badgeTone="secondary"
              titleLead={t("home.offers.title")}
              subtitle={t("home.offers.subtitle")}
              accentTone="secondary"
            />
          </div>

          <div className="mt-12">
            <FeaturedOfferBanner offer={featuredOffer} whatsapp={firstWa} />
          </div>
        </section>
      )}

      {/* ============ SERVICES — full grid, 4 columns ============ */}
      <section
        id="services"
        className="relative overflow-hidden scroll-mt-24 py-16 md:py-24"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 6%, var(--background)) 0%, var(--background) 100%)",
        }}
      >
        <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

        <div className="container mx-auto px-4">
          <SectionHeading
            badge={
              <>
                <Stethoscope className="h-3 w-3" />
                {t("home.services.title")}
              </>
            }
            badgeTone="primary"
            titleLead={t("home.services.title")}
            subtitle={t("home.services.subtitle")}
            accentTone="primary"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services?.map((s, i) => (
              <ServiceCard
                key={s.id}
                service={s}
                tone={i % 2 === 0 ? "primary" : "secondary"}
                branches={branches}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY US — light base + orange ambience + teal accents ============ */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
              <Sparkles className="h-3 w-3" />
              {t("home.badge.why")}
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
              <span className="text-foreground">{t("home.why.titleLead")} </span>
              <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                {t("home.why.titleAccent")}
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">{t("home.why.subtitle")}</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, key, tone }, idx) => {
              const isOrange = tone === "secondary";
              return (
                <div
                  key={key}
                  data-reveal-delay={idx * 100}
                  className="reveal reveal-up group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
                  style={{
                    borderColor: isOrange
                      ? "color-mix(in oklab, var(--secondary) 25%, var(--border))"
                      : "color-mix(in oklab, var(--primary) 25%, var(--border))",
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 opacity-70 transition-opacity group-hover:opacity-100"
                    style={{
                      background: isOrange
                        ? "var(--gradient-secondary)"
                        : "var(--gradient-primary)",
                    }}
                  />
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-soft)]"
                    style={{
                      background: isOrange
                        ? "var(--gradient-secondary)"
                        : "var(--gradient-primary)",
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">
                    {t(`home.why.${key}.title` as const)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`home.why.${key}.desc` as const)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ Two-tone divider band ============ */}
      <div
        aria-hidden
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--primary) 0%, var(--primary-glow) 35%, var(--secondary-glow) 65%, var(--secondary) 100%)",
        }}
      />


      {/* ============ BRANCHES — warm orange base + teal cards ============ */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--secondary) 8%, var(--background)) 0%, color-mix(in oklab, var(--primary) 6%, var(--background)) 100%)",
        }}
      >
        <div className="pointer-events-none absolute top-10 right-1/4 h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/4 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <MapPin className="h-3 w-3" />
              {t("home.badge.branches")}
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
              <span className="text-foreground">{t("home.branches.titleLead")} </span>
              <span className="bg-gradient-to-r from-secondary via-secondary-glow to-secondary bg-clip-text text-transparent">
                {t("home.branches.titleAccent")}
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">{t("home.branches.subtitle")}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {branches?.map((b, i) => {
              const accent = i % 2 === 0 ? "primary" : "secondary";
              const isPrimary = accent === "primary";
              return (
                <div
                  key={b.id}
                  data-reveal-delay={i * 120}
                  className="reveal reveal-up group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1"
                    style={{
                      background: isPrimary
                        ? "var(--gradient-primary)"
                        : "var(--gradient-secondary)",
                    }}
                  />
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-soft)]"
                    style={{
                      background: isPrimary
                        ? "var(--gradient-primary)"
                        : "var(--gradient-secondary)",
                    }}
                  >
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
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

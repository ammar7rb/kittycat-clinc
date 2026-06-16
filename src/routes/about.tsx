import { createFileRoute } from "@tanstack/react-router";
import {
  Cat,
  Heart,
  FlaskConical,
  ShieldCheck,
  MapPin,
  BookOpen,
  Eye,
  Zap,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FollowUs } from "@/components/site/FollowUs";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { useBranches, useDoctors } from "@/lib/queries";
import { UserRound } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — قصة Kitty Cat Clinic ورؤيتنا في رعاية القطط" },
      {
        name: "description",
        content:
          "تعرف على قصة Kitty Cat Clinic، أول عيادة بيطرية متخصصة حصريًا في القطط بجدة، ورؤيتنا ومهمتنا وقيمنا الأربع.",
      },
      { property: "og:title", content: "من نحن — Kitty Cat Clinic" },
      {
        property: "og:description",
        content: "قصتنا، رؤيتنا، ومهمتنا في تقديم رعاية متخصصة للقطط.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, lang } = useLanguage();
  const pick = useLocalized();
  const { data: branches } = useBranches();

  const values = [
    { icon: Cat, key: "v1" as const, tone: "secondary" as const },
    { icon: Heart, key: "v2" as const, tone: "primary" as const },
    { icon: FlaskConical, key: "v3" as const, tone: "secondary" as const },
    { icon: ShieldCheck, key: "v4" as const, tone: "primary" as const },
  ];

  return (
    <SiteLayout>
      {/* 1) Boutique hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 end-[-4rem] h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 start-[-4rem] h-72 w-72 rounded-full blur-3xl opacity-25"
          style={{ background: "var(--gradient-secondary)" }}
        />

        <div className="container relative mx-auto px-4 pt-20 pb-16 text-center md:pt-28 md:pb-20">
          <span
            className="reveal reveal-up inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold"
            style={{
              borderColor: "color-mix(in oklab, var(--primary) 25%, transparent)",
              background: "color-mix(in oklab, var(--primary) 8%, transparent)",
              color: "var(--primary)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: "var(--primary)" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: "var(--primary)" }}
              />
            </span>
            {t("about.badge")}
          </span>
          <h1 className="reveal reveal-up mt-6 text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            {t("about.title")}
          </h1>
          <p className="reveal reveal-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* 2) Story / Vision (featured) / Mission */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid items-stretch gap-8 md:grid-cols-3">
          {/* Story */}
          <article
            data-reveal-delay={0}
            className="reveal reveal-up flex flex-col rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-elegant)]"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: "color-mix(in oklab, var(--secondary) 12%, transparent)",
                color: "var(--secondary)",
              }}
            >
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-foreground">
              {t("about.story.title")}
            </h2>
            <p className="mt-4 italic leading-relaxed text-muted-foreground">
              “{t("about.story.body")}”
            </p>
          </article>

          {/* Vision — featured */}
          <article
            data-reveal-delay={100}
            className="reveal reveal-up relative flex flex-col overflow-hidden rounded-3xl p-8 text-white shadow-[var(--shadow-elegant)] md:scale-105"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 70%, #000))",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -end-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="relative mt-6 text-2xl font-bold">{t("about.vision.title")}</h2>
            <p className="relative mt-4 font-light leading-relaxed opacity-90">
              {t("about.vision.body")}
            </p>
          </article>

          {/* Mission */}
          <article
            data-reveal-delay={200}
            className="reveal reveal-up flex flex-col rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-elegant)]"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: "color-mix(in oklab, var(--primary) 12%, transparent)",
                color: "var(--primary)",
              }}
            >
              <Zap className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-foreground">
              {t("about.mission.title")}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {t("about.mission.body")}
            </p>
          </article>
        </div>
      </section>

      {/* 3) Core values */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="reveal reveal-up text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {t("about.values.title")}
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full"
            style={{ background: "var(--secondary)" }}
          />
        </div>

        <div className="mt-12 grid gap-6 grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, key, tone }, i) => {
            const isOrange = tone === "secondary";
            const accent = isOrange ? "var(--secondary)" : "var(--primary)";
            return (
              <article
                key={key}
                data-reveal-delay={i * 80}
                className="reveal reveal-up group flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-elegant)]"
                style={{ ["--accent" as never]: accent }}
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-muted-foreground transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: "color-mix(in oklab, var(--muted) 60%, transparent)",
                  }}
                >
                  <Icon
                    className="h-8 w-8 transition-colors duration-500"
                    style={{ color: "currentColor" }}
                  />
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">
                  {t(`about.values.${key}.title` as const)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {t(`about.values.${key}.desc` as const)}
                </p>
                {/* Decorative hover underline using accent */}
                <span
                  aria-hidden
                  className="mt-4 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-12"
                  style={{ background: accent }}
                />
                <style>{`
                  article[data-reveal-delay="${i * 80}"]:hover > div:first-of-type {
                    background: color-mix(in oklab, ${accent} 14%, transparent);
                    color: ${accent};
                  }
                `}</style>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4) Branches — boutique card with icon banner */}
      {branches && branches.length > 0 && (
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="reveal reveal-up mb-10 flex flex-col items-end justify-between gap-4 text-end md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--secondary)" }}>
                {t("home.badge.branches")}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-foreground md:text-4xl">
                {t("home.branches.titleLead")}{" "}
                <span style={{ color: "var(--primary)" }}>
                  {t("home.branches.titleAccent")}
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              {lang === "ar"
                ? "متواجدون دائماً بالقرب منك لضمان حصول قطتك على أفضل رعاية في أسرع وقت."
                : "Always close to you, so your cat gets the best care, fast."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {branches.map((b, i) => {
              const isOrange = i % 2 === 1;
              const accent = isOrange ? "var(--secondary)" : "var(--primary)";
              return (
                <article
                  key={b.id}
                  data-reveal-delay={i * 110}
                  className="reveal reveal-up group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-elegant)]"
                >
                  {/* Icon banner */}
                  <div
                    className="flex h-32 items-center justify-center transition-all duration-500"
                    style={{
                      background: `color-mix(in oklab, ${accent} 12%, transparent)`,
                      color: accent,
                    }}
                  >
                    <span
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/0 transition-all duration-500 group-hover:scale-110"
                      style={{
                        background: `color-mix(in oklab, ${accent} 18%, transparent)`,
                      }}
                    >
                      <MapPin className="h-8 w-8" />
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold text-foreground">
                      {pick(b, "name")}
                    </h3>
                    {pick(b, "address") && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {pick(b, "address")}
                      </p>
                    )}
                    {b.maps_url && (
                      <a
                        href={b.maps_url}
                        target="_blank"
                        rel="noopener"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-3"
                        style={{ color: accent }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        {lang === "ar"
                          ? "عرض الموقع على الخريطة"
                          : "View on map"}
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 5) Follow us — filled boutique style */}
      <section className="container mx-auto px-4 pb-20">
        <FollowUs variant="filled" />
      </section>
    </SiteLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Cat, Heart, FlaskConical, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { useBranches } from "@/lib/queries";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — قصة Kitty Cat Clinic ورؤيتنا في رعاية القطط" },
      {
        name: "description",
        content:
          "تعرف على قصة Kitty Cat Clinic، أول عيادة بيطرية في الإمارات متخصصة حصريًا في القطط، ورؤيتنا ومهمتنا وقيمنا الأربع.",
      },
      { property: "og:title", content: "من نحن — Kitty Cat Clinic" },
      {
        property: "og:description",
        content: "قصتنا، رؤيتنا، ومهمتنا في تقديم رعاية متخصصة للقطط.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useLanguage();
  const pick = useLocalized();
  const { data: branches } = useBranches();

  const values = [
    { icon: Cat, key: "v1" as const },
    { icon: Heart, key: "v2" as const },
    { icon: FlaskConical, key: "v3" as const },
    { icon: ShieldCheck, key: "v4" as const },
  ];

  return (
    <SiteLayout>
      <PageHero
        badge={
          <>
            <Sparkles className="h-3.5 w-3.5" />
            {t("about.badge")}
          </>
        }
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      />

      {/* Story / Vision / Mission */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {([
            { title: "about.story.title", body: "about.story.body", tone: "primary" },
            { title: "about.vision.title", body: "about.vision.body", tone: "secondary" },
            { title: "about.mission.title", body: "about.mission.body", tone: "primary" },
          ] as const).map((b, i) => {
            const isOrange = b.tone === "secondary";
            return (
              <article
                key={i}
                className="relative overflow-hidden rounded-2xl border bg-card p-7"
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
                <h2 className="text-xl font-bold text-foreground">{t(b.title)}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(b.body)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section
        className="relative overflow-hidden py-16 md:py-20"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 6%, var(--background)) 0%, var(--background) 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <SectionHeading
            badge={
              <>
                <Heart className="h-3 w-3" />
                {t("about.values.title")}
              </>
            }
            badgeTone="secondary"
            titleLead={t("about.values.title")}
            accentTone="secondary"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, key }, i) => {
              const isOrange = i % 2 === 1;
              return (
                <div
                  key={key}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
                >
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
                  <h3 className="mt-4 text-lg font-bold text-foreground">
                    {t(`about.values.${key}.title` as const)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`about.values.${key}.desc` as const)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Branches summary */}
      {branches && branches.length > 0 && (
        <section className="container mx-auto px-4 py-16 md:py-20">
          <SectionHeading
            badge={
              <>
                <MapPin className="h-3 w-3" />
                {t("home.badge.branches")}
              </>
            }
            titleLead={t("home.branches.titleLead")}
            titleAccent={t("home.branches.titleAccent")}
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {branches.map((b) => (
              <li
                key={b.id}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-foreground">{pick(b, "name")}</div>
                  {pick(b, "address") && (
                    <div className="text-sm text-muted-foreground">{pick(b, "address")}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </SiteLayout>
  );
}

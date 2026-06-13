import { useEffect, useState } from "react";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { OfferRow } from "@/lib/queries";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Props = {
  offer: OfferRow;
  whatsapp?: string | null;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
};

function computeTimeLeft(end: string | null): TimeLeft {
  if (!end) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: false };
  const diff = new Date(end).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    ended: false,
  };
}

export function FeaturedOfferBanner({ offer, whatsapp }: Props) {
  const pick = useLocalized();
  const { t, dir } = useLanguage();
  const [time, setTime] = useState<TimeLeft>(() => computeTimeLeft(offer.end_date));

  useEffect(() => {
    if (!offer.end_date) return;
    const id = setInterval(() => setTime(computeTimeLeft(offer.end_date)), 1000);
    return () => clearInterval(id);
  }, [offer.end_date]);

  const showTimer = !!offer.end_date && !time.ended;
  const title = pick(offer, "title");
  const desc = pick(offer, "description");

  const units = [
    { value: time.days, label: t("offer.days") },
    { value: time.hours, label: t("offer.hours") },
    { value: time.minutes, label: t("offer.minutes") },
    { value: time.seconds, label: t("offer.seconds"), accent: true },
  ];

  return (
    <article className="reveal reveal-up container mx-auto px-4">
      <div
        className="relative w-full overflow-hidden rounded-[2.5rem] border-4 border-background bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-stretch min-h-[520px]"
      >
        {/* Background decorative glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[10%] -left-[5%] w-64 h-64 rounded-full blur-[100px]"
          style={{ background: "color-mix(in oklab, var(--primary) 18%, transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[10%] right-[20%] w-96 h-96 rounded-full blur-[120px]"
          style={{ background: "color-mix(in oklab, var(--secondary) 12%, transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[10%] right-[20%] w-96 h-96 rounded-full blur-[120px]"
          style={{ background: "color-mix(in oklab, hsl(var(--secondary)) 12%, transparent)" }}
        />

        {/* Content Column */}
        <div className="relative z-20 flex-1 p-8 md:p-14 flex flex-col justify-center gap-7">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {t("home.offers.title")}
            </div>

            <h3 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
              {title}
            </h3>

            {desc && (
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-lg font-medium">
                {desc}
              </p>
            )}
          </div>

          {/* Countdown */}
          {showTimer && (
            <div className="flex flex-wrap items-center gap-3" dir="ltr">
              {units.map((u) => (
                <div
                  key={u.label}
                  className={
                    u.accent
                      ? "flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30"
                      : "flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-foreground/5 backdrop-blur-md border border-foreground/10"
                  }
                >
                  <span className="text-2xl font-black tabular-nums">
                    {String(u.value).padStart(2, "0")}
                  </span>
                  <span
                    className={
                      u.accent
                        ? "text-[11px] font-bold uppercase tracking-tighter opacity-90"
                        : "text-[11px] font-bold uppercase tracking-tighter text-primary"
                    }
                  >
                    {u.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {time.ended && (
            <div className="rounded-2xl border border-border bg-muted px-4 py-3 text-sm font-bold text-foreground w-fit">
              {t("offer.ended")}
            </div>
          )}

          {/* CTA */}
          {whatsapp && (
            <div className="flex items-center gap-6 flex-wrap">
              <a
                href={buildWhatsAppUrl(whatsapp, `${t("wa.offerMsg")} ${title}`)}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-secondary to-secondary-glow px-8 py-4 text-lg font-black text-secondary-foreground shadow-[var(--shadow-elegant)] transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="h-6 w-6" />
                {t("common.bookNow")}
              </a>
            </div>
          )}
        </div>

        {/* Image Column */}
        <div
          className={`relative w-full md:w-[45%] overflow-hidden bg-muted ${
            dir === "rtl" ? "md:border-r md:border-l-0" : "md:border-l md:border-r-0"
          } border-border min-h-[320px]`}
        >
          {offer.image_url ? (
            <img
              src={offer.image_url}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: "var(--gradient-secondary)" }}
            />
          )}

          {/* Side fade into card */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                dir === "rtl"
                  ? "linear-gradient(270deg, var(--card) 0%, color-mix(in oklab, var(--card) 40%, transparent) 30%, transparent 70%)"
                  : "linear-gradient(90deg, var(--card) 0%, color-mix(in oklab, var(--card) 40%, transparent) 30%, transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--primary) 12%, transparent), color-mix(in oklab, var(--secondary) 12%, transparent))",
            }}
          />

          {/* Floating Promo Badge */}
          <div className={`absolute top-8 ${dir === "rtl" ? "right-8" : "left-8"}`}>
            <div
              className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center text-center leading-none font-black shadow-2xl border-4 border-background -rotate-12 transition-transform hover:rotate-0 duration-300"
            >
              <span className="text-[10px] uppercase opacity-80 tracking-widest">
                {t("offer.badgeTop")}
              </span>
              <span className="text-xl">{t("offer.badgeBottom")}</span>
            </div>
          </div>

          {/* Floating Quality Card */}
          <div
            className={`absolute bottom-8 ${
              dir === "rtl" ? "right-8 left-8" : "left-8 right-8"
            } p-5 rounded-3xl bg-card/80 backdrop-blur-xl border border-border hidden md:block`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-bold text-sm">
                  {t("offer.trustTitle")}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {t("offer.trustDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

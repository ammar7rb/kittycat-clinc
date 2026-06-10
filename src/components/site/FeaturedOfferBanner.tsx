import { useEffect, useState } from "react";
import { Gift, MessageCircle, Clock } from "lucide-react";
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
  const { t } = useLanguage();
  const [time, setTime] = useState<TimeLeft>(() => computeTimeLeft(offer.end_date));

  useEffect(() => {
    if (!offer.end_date) return;
    const id = setInterval(() => setTime(computeTimeLeft(offer.end_date)), 1000);
    return () => clearInterval(id);
  }, [offer.end_date]);

  const showTimer = !!offer.end_date && !time.ended;
  const title = pick(offer, "title");
  const desc = pick(offer, "description");

  const units: Array<{ value: number; label: string }> = [
    { value: time.days, label: t("offer.days") },
    { value: time.hours, label: t("offer.hours") },
    { value: time.minutes, label: t("offer.minutes") },
    { value: time.seconds, label: t("offer.seconds") },
  ];

  return (
    <article className="reveal reveal-up relative w-full overflow-hidden">
      {/* Full-width image */}
      <div className="relative h-[420px] w-full md:h-[520px]">
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

        {/* Dark gradient overlay for legibility */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-10 md:pb-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              {/* Left: title / description */}
              <div className="max-w-2xl text-white">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Gift className="h-3.5 w-3.5" />
                  {t("home.offers.title")}
                </div>
                <h3 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
                  {title}
                </h3>
                {desc && (
                  <p className="mt-3 text-sm leading-relaxed text-white/85 md:text-base">
                    {desc}
                  </p>
                )}

                {whatsapp && (
                  <a
                    href={buildWhatsAppUrl(
                      whatsapp,
                      `${t("wa.offerMsg")} ${title}`,
                    )}
                    target="_blank"
                    rel="noopener"
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-secondary to-secondary-glow px-6 py-3 font-bold text-secondary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-105"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {t("common.bookNow")}
                  </a>
                )}
              </div>

              {/* Right: countdown */}
              {showTimer && (
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/90">
                    <Clock className="h-3.5 w-3.5" />
                    {t("offer.endsIn")}
                  </div>
                  <div className="flex gap-2 md:gap-3" dir="ltr">
                    {units.map((u) => (
                      <div
                        key={u.label}
                        className="flex min-w-[64px] flex-col items-center rounded-xl bg-white/15 px-3 py-3 backdrop-blur md:min-w-[72px]"
                      >
                        <span className="text-2xl font-black tabular-nums text-white md:text-3xl">
                          {String(u.value).padStart(2, "0")}
                        </span>
                        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                          {u.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {offer.end_date && time.ended && (
                <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur">
                  {t("offer.ended")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

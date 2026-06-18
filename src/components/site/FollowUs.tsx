import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Music2,
  Sparkles,
  Ghost,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSettings } from "@/lib/queries";

type Social = {
  url?: string;
  Icon: LucideIcon;
  label: string;
  handle: string;
  gradient: string;
};

export function FollowUs({
  compact = false,
  variant = "card",
}: {
  compact?: boolean;
  variant?: "card" | "filled";
}) {
  const { t } = useLanguage();
  const { data: settings } = useSettings();
  const filled = variant === "filled";

  const socials: Social[] = [
    {
      url: settings?.instagram,
      Icon: Instagram,
      label: "Instagram",
      handle: "@kitty.cat.clinic",
      gradient: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)",
    },
    {
      url: settings?.tiktok,
      Icon: Music2,
      label: "TikTok",
      handle: "@kitty.cat.clinic",
      gradient: "linear-gradient(135deg, #25f4ee, #000000, #fe2c55)",
    },
    {
      url: settings?.facebook,
      Icon: Facebook,
      label: "Facebook",
      handle: "Kitty Cat Clinic",
      gradient: "linear-gradient(135deg, #1877f2, #0a4fbf)",
    },
    {
      url: settings?.snapchat,
      Icon: Ghost,
      label: "Snapchat",
      handle: "kittycat2026960",
      gradient: "linear-gradient(135deg, #fffc00, #f7e500)",
    },
    {
      url: settings?.youtube,
      Icon: Youtube,
      label: "YouTube",
      handle: "Kitty Cat Clinic",
      gradient: "linear-gradient(135deg, #ff0000, #b80000)",
    },
    {
      url: settings?.twitter,
      Icon: Twitter,
      label: "X",
      handle: "@kittycatclinic",
      gradient: "linear-gradient(135deg, #0a0a0a, #404040)",
    },
  ].filter((s) => !!s.url) as Social[];

  if (socials.length === 0) return null;

  return (
    <section
      className={`reveal reveal-up relative overflow-hidden ${
        filled
          ? "rounded-[3rem] text-white"
          : "rounded-3xl border border-border bg-card"
      } ${compact ? "p-8" : "p-10 md:p-14"}`}
      style={
        filled
          ? {
              background:
                "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 70%, #000))",
            }
          : undefined
      }
    >
      {/* Decorative glows */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-24 -end-24 h-64 w-64 rounded-full blur-3xl ${
          filled ? "opacity-25" : "opacity-40"
        }`}
        style={{
          background: filled ? "#ffffff" : "var(--gradient-primary)",
        }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute -bottom-24 -start-24 h-64 w-64 rounded-full blur-3xl ${
          filled ? "opacity-40" : "opacity-30"
        }`}
        style={{
          background: filled
            ? "color-mix(in oklab, var(--secondary) 70%, transparent)"
            : "var(--gradient-secondary)",
        }}
      />

      <div className="relative text-center">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
          style={
            filled
              ? {
                  borderColor: "color-mix(in oklab, #ffffff 35%, transparent)",
                  background: "color-mix(in oklab, #ffffff 15%, transparent)",
                  color: "#ffffff",
                }
              : {
                  borderColor: "color-mix(in oklab, var(--secondary) 35%, transparent)",
                  background: "color-mix(in oklab, var(--secondary) 12%, transparent)",
                  color: "var(--secondary)",
                }
          }
        >
          <Sparkles className="h-3 w-3" />
          {t("follow.badge")}
        </span>
        <h2
          className={`mt-4 text-3xl font-extrabold md:text-4xl ${
            filled ? "text-white" : "text-foreground"
          }`}
        >
          {t("follow.title")}
        </h2>
        <p
          className={`mt-3 max-w-xl mx-auto text-sm leading-relaxed md:text-base ${
            filled ? "text-white/80" : "text-muted-foreground"
          }`}
        >
          {t("follow.subtitle")}
        </p>
      </div>

      <div
        className={`relative mt-8 grid gap-3 grid-cols-2 ${
          socials.length >= 6
            ? "sm:grid-cols-3 lg:grid-cols-6"
            : socials.length === 5
              ? "sm:grid-cols-3 lg:grid-cols-5"
              : socials.length >= 4
                ? "sm:grid-cols-2 lg:grid-cols-4"
                : socials.length === 3
                  ? "sm:grid-cols-3"
                  : "sm:grid-cols-2"
        }`}
      >
        {socials.map(({ url, Icon, label, handle, gradient }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener"
            aria-label={label}
            className={`group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border p-4 text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[var(--shadow-elegant)] ${
              filled
                ? "border-white/15 bg-white/10 backdrop-blur-sm"
                : "border-border bg-background"
            }`}
          >
            {/* Hover gradient sweep */}
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: gradient }}
            />
            <span
              className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-500 group-hover:scale-110"
              style={{ background: gradient }}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span
              className={`relative z-10 text-sm font-bold transition-colors duration-500 group-hover:text-white ${
                filled ? "text-white" : "text-foreground"
              }`}
            >
              {label}
            </span>
            <span
              dir="ltr"
              className={`relative z-10 text-xs transition-colors duration-500 group-hover:text-white/85 ${
                filled ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {handle}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

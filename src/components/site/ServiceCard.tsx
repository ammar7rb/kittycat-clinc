import {
  Stethoscope,
  Syringe,
  Sparkles,
  Scissors,
  Activity,
  Home,
  Heart,
  ShieldCheck,
  Cat,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { ServiceRow } from "@/lib/queries";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const ICONS: Record<string, LucideIcon> = {
  Stethoscope,
  Syringe,
  Sparkles,
  Scissors,
  Activity,
  Home,
  Heart,
  ShieldCheck,
  Cat,
};

const CATEGORIES: Record<string, string> = {
  Stethoscope: "CLINIC",
  Syringe: "SAFETY",
  Sparkles: "DENTAL",
  Scissors: "SURGERY",
  Activity: "IMAGING",
  Home: "BOARDING",
  Heart: "NUTRITION",
  ShieldCheck: "PREVENT",
  Cat: "BEHAVIOR",
};

type Props = {
  service: ServiceRow;
  tone?: "primary" | "secondary";
  whatsapp?: string | null;
  index?: number;
};

export function ServiceCard({ service, tone = "primary", whatsapp, index = 0 }: Props) {
  const pick = useLocalized();
  const { t } = useLanguage();
  const Icon = (service.icon && ICONS[service.icon]) || Stethoscope;
  const isOrange = tone === "secondary";
  const number = String(index + 1).padStart(2, "0");
  const category = (service.icon && CATEGORIES[service.icon]) || "CLINIC";

  const accent = isOrange ? "var(--secondary)" : "var(--primary)";
  const gradient = isOrange ? "var(--gradient-secondary)" : "var(--gradient-primary)";

  return (
    <article
      className="reveal reveal-up group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-elegant)]"
      data-reveal-delay={typeof index === "number" ? index * 90 : undefined}
    >
      {/* Top gradient stripe */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: gradient }}
      />

      {/* Icon + number row */}
      <div className="mb-8 flex items-center justify-between">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110"
          style={{
            background: `color-mix(in oklab, ${accent} 12%, transparent)`,
            color: accent,
          }}
        >
          <Icon className="h-8 w-8" />
        </div>
        <div className="text-end opacity-30 select-none" dir="ltr">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-sans">
            {category}
          </span>
          <span className="block text-lg font-black leading-none text-foreground font-sans">
            {number}
          </span>
        </div>
      </div>

      {/* Titles */}
      <h3 className="text-2xl font-extrabold leading-tight text-foreground">
        {pick(service, "name")}
      </h3>
      <p
        className="mt-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: `color-mix(in oklab, ${accent} 75%, transparent)` }}
        dir="ltr"
      >
        {service.name_en}
      </p>

      {/* Description */}
      {pick(service, "description") && (
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          {pick(service, "description")}
        </p>
      )}

      {/* Action */}
      {whatsapp && (
        <div className="mt-auto pt-8">
          <a
            href={buildWhatsAppUrl(whatsapp, `${t("wa.serviceMsg")} ${pick(service, "name")}`)}
            target="_blank"
            rel="noopener"
            className="group/btn inline-flex w-full items-center justify-center gap-3 rounded-2xl border-2 px-6 py-4 font-bold transition-all duration-300"
            style={{
              borderColor: accent,
              color: accent,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = accent;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = accent;
            }}
          >
            <span>{t("common.bookNow")}</span>
            <MessageCircle className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
          </a>
        </div>
      )}
    </article>
  );
}

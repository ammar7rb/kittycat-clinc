import { useEffect, useRef, useState } from "react";
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
  Smile,
  FlaskConical,
  Apple,
  MessageCircle,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { BranchRow, ServiceRow } from "@/lib/queries";
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
  Smile,
  FlaskConical,
  Apple,
};

const CATEGORIES: Record<string, string> = {
  Stethoscope: "EXAM",
  Syringe: "VACCINES",
  Sparkles: "GROOMING",
  Scissors: "SURGERY",
  Activity: "IMAGING",
  Home: "BOARDING",
  Heart: "NUTRITION",
  ShieldCheck: "PREVENT",
  Cat: "BEHAVIOR",
  Smile: "DENTAL",
  FlaskConical: "LAB",
  Apple: "NUTRITION",
};

type Props = {
  service: ServiceRow;
  tone?: "primary" | "secondary";
  branches?: BranchRow[];
  index?: number;
};

export function ServiceCard({ service, tone = "primary", branches, index = 0 }: Props) {
  const pick = useLocalized();
  const { t } = useLanguage();
  const Icon = (service.icon && ICONS[service.icon]) || Stethoscope;
  const isOrange = tone === "secondary";
  const number = String(index + 1).padStart(2, "0");
  const category = (service.icon && CATEGORIES[service.icon]) || "CLINIC";

  const accent = isOrange ? "var(--secondary)" : "var(--primary)";
  const gradient = isOrange ? "var(--gradient-secondary)" : "var(--gradient-primary)";

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const availableBranches = (branches ?? []).filter((b) => b.whatsapp);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
          className="service-card-icon flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110"
          style={{
            ["--accent" as any]: accent,
            ["--accent-gradient" as any]: gradient,
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
      {availableBranches.length > 0 && (
        <div ref={rootRef} className="relative mt-auto pt-8">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="group/btn inline-flex w-full items-center justify-center gap-3 rounded-2xl border-2 px-6 py-4 font-bold transition-all duration-300"
            style={{ borderColor: accent, color: accent }}
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
          </button>

          {open && (
            <div
              role="menu"
              className="absolute bottom-full left-1/2 z-30 mb-3 w-[260px] -translate-x-1/2 rounded-2xl border border-border bg-card/90 p-3 shadow-[var(--shadow-elegant)] backdrop-blur-xl animate-in fade-in zoom-in-95"
            >
              <div className="mb-2 px-2 text-xs font-bold text-muted-foreground">
                {t("common.chooseBranchToBook")}
              </div>
              <ul className="space-y-1.5">
                {availableBranches.map((b) => (
                  <li key={b.id}>
                    <a
                      href={buildWhatsAppUrl(
                        b.whatsapp ?? "",
                        `${t("wa.serviceMsg")} ${pick(service, "name")}`,
                      )}
                      target="_blank"
                      rel="noopener"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium transition-all hover:border-[color:var(--whatsapp)] hover:bg-accent"
                    >
                      <span className="flex items-center gap-2 text-foreground">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {pick(b, "name")}
                      </span>
                      <MessageCircle className="h-4 w-4 text-[color:var(--whatsapp)]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

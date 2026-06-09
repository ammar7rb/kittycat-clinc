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
  type LucideIcon,
} from "lucide-react";
import { ServiceRow } from "@/lib/queries";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

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

type Props = {
  service: ServiceRow;
  tone?: "primary" | "secondary";
  whatsapp?: string | null;
};

export function ServiceCard({ service, tone = "primary", whatsapp }: Props) {
  const pick = useLocalized();
  const { t } = useLanguage();
  const Icon = (service.icon && ICONS[service.icon]) || Stethoscope;
  const isOrange = tone === "secondary";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
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
          background: isOrange ? "var(--gradient-secondary)" : "var(--gradient-primary)",
        }}
      />
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-soft)]"
        style={{
          background: isOrange ? "var(--gradient-secondary)" : "var(--gradient-primary)",
        }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-foreground">{pick(service, "name")}</h3>
      {pick(service, "description") && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {pick(service, "description")}
        </p>
      )}
      {whatsapp && (
        <div className="mt-5 pt-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="w-full border-[color:var(--whatsapp)]/40 text-[color:var(--whatsapp)] hover:bg-[color:var(--whatsapp)]/10"
          >
            <a
              href={buildWhatsAppUrl(whatsapp, `${t("wa.serviceMsg")} ${pick(service, "name")}`)}
              target="_blank"
              rel="noopener"
            >
              <MessageCircle className="h-4 w-4 me-1" />
              {t("common.bookNow")}
            </a>
          </Button>
        </div>
      )}
    </article>
  );
}

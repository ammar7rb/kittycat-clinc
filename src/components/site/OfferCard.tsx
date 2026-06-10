import { Gift, MessageCircle } from "lucide-react";
import { OfferRow } from "@/lib/queries";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Props = {
  offer: OfferRow;
  whatsapp?: string | null;
};

export function OfferCard({ offer, whatsapp }: Props) {
  const pick = useLocalized();
  const { t } = useLanguage();

  return (
    <article
      className="reveal reveal-up group relative flex flex-col overflow-hidden rounded-2xl p-[1.5px] transition-transform hover:-translate-y-1"
      style={{ background: "var(--gradient-secondary)" }}
    >
      <div className="flex flex-1 flex-col rounded-[14px] bg-card p-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-[var(--shadow-soft)]"
            style={{ background: "var(--gradient-secondary)" }}
          >
            <Gift className="h-5 w-5" />
          </div>
          <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary">
            {t("home.offers.title")}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold text-foreground">{pick(offer, "title")}</h3>
        {pick(offer, "description") && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {pick(offer, "description")}
          </p>
        )}

        {whatsapp && (
          <div className="mt-auto pt-5">
            <Button
              asChild
              size="sm"
              className="w-full bg-gradient-to-r from-secondary to-secondary-glow text-secondary-foreground hover:opacity-95"
            >
              <a
                href={buildWhatsAppUrl(whatsapp, `${t("wa.offerMsg")} ${pick(offer, "title")}`)}
                target="_blank"
                rel="noopener"
              >
                <MessageCircle className="h-4 w-4 me-1" />
                {t("common.bookNow")}
              </a>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}

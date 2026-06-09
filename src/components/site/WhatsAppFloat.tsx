import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { useBranches } from "@/lib/queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function WhatsAppFloat() {
  const { t, lang } = useLanguage();
  const pick = useLocalized();
  const { data: branches } = useBranches();
  const [open, setOpen] = useState(false);

  if (!branches?.length) return null;

  const defaultMsg = t("wa.defaultMsg");

  return (
    <>
      {/* Backdrop */}
      {open && (
        <button
          aria-label="close"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        />
      )}

      {/* Branch picker */}
      <div
        className={cn(
          "fixed bottom-24 z-50 w-[280px] rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-elegant)] transition-all duration-300",
          lang === "ar" ? "right-5" : "left-5",
          open
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-4 opacity-0 pointer-events-none",
        )}
      >
        <div className="mb-3 text-sm font-bold text-foreground">
          {t("wa.chooseBranchTitle")}
        </div>
        <ul className="space-y-2">
          {branches.map((b) => (
            <li key={b.id}>
              <a
                href={buildWhatsAppUrl(b.whatsapp ?? "", defaultMsg)}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm transition-all hover:border-primary hover:bg-accent hover:shadow-[var(--shadow-soft)]"
              >
                <span className="font-medium text-foreground">{pick(b, "name")}</span>
                <MessageCircle className="h-4 w-4 text-[color:var(--whatsapp)]" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="WhatsApp"
        className={cn(
          "fixed bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--whatsapp)] text-[color:var(--whatsapp-foreground)] shadow-[var(--shadow-elegant)] transition-transform hover:scale-110 active:scale-95",
          lang === "ar" ? "right-5" : "left-5",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-0 -end-0 h-3 w-3 rounded-full bg-secondary ring-2 ring-background animate-pulse" />
        )}
      </button>
    </>
  );
}

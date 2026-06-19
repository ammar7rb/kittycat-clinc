import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MapPin, MessageCircle } from "lucide-react";
import type { BranchRow } from "@/lib/queries";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  branches?: BranchRow[] | null;
  message: string;
  children: ReactNode;
  className?: string;
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  menuPosition?: "top" | "bottom";
  menuAlign?: "center" | "start" | "end";
  onHoverStyles?: {
    enter?: (el: HTMLButtonElement) => void;
    leave?: (el: HTMLButtonElement) => void;
  };
};

export function BranchWhatsAppMenu({
  branches,
  message,
  children,
  className,
  buttonClassName,
  buttonStyle,
  menuPosition = "top",
  menuAlign = "center",
  onHoverStyles,
}: Props) {
  const { t } = useLanguage();
  const pick = useLocalized();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const available = (branches ?? []).filter((b) => b.whatsapp);

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

  if (available.length === 0) return null;

  const alignClass =
    menuAlign === "start"
      ? "start-0"
      : menuAlign === "end"
        ? "end-0"
        : "left-1/2 -translate-x-1/2";

  const posClass = menuPosition === "top" ? "bottom-full mb-3" : "top-full mt-3";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={buttonClassName}
        style={buttonStyle}
        onMouseEnter={(e) => onHoverStyles?.enter?.(e.currentTarget)}
        onMouseLeave={(e) => onHoverStyles?.leave?.(e.currentTarget)}
      >
        {children}
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-30 w-[260px] rounded-2xl border border-border bg-card/95 p-3 shadow-[var(--shadow-elegant)] backdrop-blur-xl animate-in fade-in zoom-in-95",
            posClass,
            alignClass,
          )}
        >
          <div className="mb-2 px-2 text-xs font-bold text-muted-foreground">
            {t("common.chooseBranchToBook")}
          </div>
          <ul className="space-y-1.5">
            {available.map((b) => (
              <li key={b.id}>
                <a
                  href={buildWhatsAppUrl(b.whatsapp ?? "", message)}
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
  );
}

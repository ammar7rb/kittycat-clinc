import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  badge?: ReactNode;
  badgeTone?: "primary" | "secondary";
  titleLead: string;
  titleAccent?: string;
  accentTone?: "primary" | "secondary";
  subtitle?: string;
  className?: string;
};

export function SectionHeading({
  badge,
  badgeTone = "primary",
  titleLead,
  titleAccent,
  accentTone = "primary",
  subtitle,
  className,
}: Props) {
  const badgeColor =
    badgeTone === "secondary"
      ? "border-secondary/30 bg-secondary/10 text-secondary"
      : "border-primary/30 bg-primary/10 text-primary";

  const accentGradient =
    accentTone === "secondary"
      ? "from-secondary via-secondary-glow to-secondary"
      : "from-primary via-primary-glow to-primary";

  return (
    <div className={cn("reveal reveal-up mx-auto max-w-2xl text-center", className)}>
      {badge && (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
            badgeColor,
          )}
        >
          {badge}
        </div>
      )}
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
        <span className="text-foreground">{titleLead} </span>
        {titleAccent && (
          <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", accentGradient)}>
            {titleAccent}
          </span>
        )}
      </h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

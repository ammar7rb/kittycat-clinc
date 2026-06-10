import type { ReactNode } from "react";

type Props = {
  badge?: ReactNode;
  title: string;
  subtitle?: string;
};

/**
 * Compact page hero used on inner pages (services, about, contact).
 * Dark teal gradient to match the homepage hero language.
 */
export function PageHero({ badge, title, subtitle }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="pointer-events-none absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 -z-10 h-80 w-80 rounded-full bg-primary-glow/25 blur-3xl" />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="reveal reveal-blur mx-auto max-w-3xl text-center">
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {badge}
            </div>
          )}
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-base/relaxed text-white/85 md:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
}

import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

/**
 * Global scroll-reveal: observes any element with class `reveal` on the page
 * and toggles `is-visible` when it enters the viewport. Re-scans on route changes
 * and on DOM mutations so dynamically rendered sections animate too.
 *
 * Supports optional per-element stagger via `data-reveal-delay="120"` (ms).
 */
export function ScrollReveal() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) =>
        el.classList.add("is-visible"),
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay;
            if (delay) {
              el.style.transitionDelay = `${delay}ms`;
            }
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        .forEach((el) => observer.observe(el));
    };

    scan();

    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
    // Re-init when route changes
  }, [router.state.location.pathname]);

  return null;
}

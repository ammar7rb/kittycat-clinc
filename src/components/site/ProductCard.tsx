import { Instagram, ShoppingBag, Cat, Dog, PawPrint } from "lucide-react";
import type { ProductRow } from "@/lib/queries";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { useSettings } from "@/lib/queries";
import { Button } from "@/components/ui/button";

export function ProductCard({
  product,
  index = 0,
}: {
  product: ProductRow;
  whatsapp?: string | null;
  index?: number;
}) {
  const { lang } = useLanguage();
  const pick = useLocalized();
  const { data: settings } = useSettings();
  const instagramUrl = settings?.instagram;
  const name = pick(product, "name");
  const desc = pick(product, "description");
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / Number(product.compare_at_price)) * 100)
    : 0;

  const petIcon =
    product.pet_type === "dog" ? Dog : product.pet_type === "both" ? PawPrint : Cat;
  const PetIcon = petIcon;

  return (
    <article
      data-reveal-delay={index * 80}
      className="reveal reveal-up group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={name}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-2">
          {product.is_featured && (
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-md"
              style={{ background: "var(--gradient-secondary)" }}
            >
              {lang === "ar" ? "مميز" : "Featured"}
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-destructive px-3 py-1 text-[10px] font-bold text-destructive-foreground shadow-md">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Pet type pill */}
        <div className="absolute top-3 end-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur-sm shadow-sm">
            <PetIcon className="h-3 w-3 text-primary" />
            {product.pet_type === "cat"
              ? lang === "ar" ? "قطط" : "Cats"
              : product.pet_type === "dog"
                ? lang === "ar" ? "كلاب" : "Dogs"
                : lang === "ar" ? "الجميع" : "All pets"}
          </span>
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <span className="rounded-full bg-foreground/90 px-4 py-1.5 text-xs font-bold text-background">
              {lang === "ar" ? "نفذت الكمية" : "Out of stock"}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="min-h-[18px]">
          {product.brand && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {product.brand}
            </span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] text-base font-bold leading-snug text-foreground">
          {name}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground">
          {desc ?? ""}
        </p>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="text-2xl font-extrabold text-foreground">
            {Number(product.price).toFixed(0)}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {product.currency}
          </span>
          {hasDiscount && (
            <span className="text-sm font-medium text-muted-foreground/70 line-through">
              {Number(product.compare_at_price).toFixed(0)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4">
          {instagramUrl && product.stock > 0 ? (
            <Button
              asChild
              size="sm"
              className="w-full text-white hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              }}
            >
              <a href={instagramUrl} target="_blank" rel="noopener">
                <Instagram className="h-4 w-4 me-1.5" />
                {lang === "ar" ? "اطلب الآن" : "Order now"}
              </a>
            </Button>
          ) : (
            <Button size="sm" disabled className="w-full">
              {lang === "ar" ? "غير متاح" : "Unavailable"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

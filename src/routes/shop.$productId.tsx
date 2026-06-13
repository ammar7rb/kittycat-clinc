import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, ShoppingBag, Cat, Dog, PawPrint } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useLanguage, useLocalized } from "@/lib/i18n/LanguageProvider";
import { supabase } from "@/integrations/supabase/client";
import { useBranches } from "@/lib/queries";
import type { ProductRow } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/shop/$productId")({
  component: ProductDetailPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">المنتج غير موجود</h1>
        <Button asChild className="mt-6">
          <Link to="/shop">العودة للمتجر</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-24 text-center text-destructive">
        {error.message}
      </div>
    </SiteLayout>
  ),
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const { lang } = useLanguage();
  const pick = useLocalized();
  const { data: branches } = useBranches();
  const firstWa = branches?.[0]?.whatsapp;

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<ProductRow | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return (data as ProductRow | null) ?? null;
    },
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">
          {lang === "ar" ? "جاري التحميل..." : "Loading..."}
        </div>
      </SiteLayout>
    );
  }

  if (!product) throw notFound();

  const name = pick(product, "name");
  const desc = pick(product, "description");
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const PetIcon =
    product.pet_type === "dog" ? Dog : product.pet_type === "both" ? PawPrint : Cat;

  const waMsg =
    lang === "ar"
      ? `السلام عليكم، أرغب في طلب: ${name} — السعر: ${product.price} ${product.currency}`
      : `Hello, I'd like to order: ${name} — Price: ${product.price} ${product.currency}`;

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-10 md:py-14">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className={`h-4 w-4 ${lang === "ar" ? "rotate-180" : ""}`} />
          {lang === "ar" ? "العودة للمتجر" : "Back to shop"}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-muted/50 to-muted shadow-[var(--shadow-elegant)]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={name}
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.brand && (
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {product.brand}
              </span>
            )}
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
              {name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <PetIcon className="h-3.5 w-3.5" />
                {product.pet_type === "cat"
                  ? lang === "ar" ? "للقطط" : "For cats"
                  : product.pet_type === "dog"
                    ? lang === "ar" ? "للكلاب" : "For dogs"
                    : lang === "ar" ? "للجميع" : "For all pets"}
              </span>
              {product.is_featured && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{ background: "var(--gradient-secondary)" }}
                >
                  {lang === "ar" ? "مميز" : "Featured"}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-foreground">
                {Number(product.price).toFixed(0)}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {product.currency}
              </span>
              {hasDiscount && (
                <span className="text-lg font-medium text-muted-foreground/70 line-through">
                  {Number(product.compare_at_price).toFixed(0)}
                </span>
              )}
            </div>

            {desc && (
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {desc}
              </p>
            )}

            <div className="mt-6 text-sm text-muted-foreground">
              {product.stock > 0
                ? lang === "ar"
                  ? `متوفر — ${product.stock} قطعة`
                  : `In stock — ${product.stock} units`
                : lang === "ar"
                  ? "نفذت الكمية حالياً"
                  : "Out of stock"}
            </div>

            <div className="mt-auto pt-8">
              {firstWa && product.stock > 0 && (
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-[color:var(--whatsapp)] text-[color:var(--whatsapp-foreground)] hover:opacity-90 sm:w-auto"
                >
                  <a
                    href={buildWhatsAppUrl(firstWa, waMsg)}
                    target="_blank"
                    rel="noopener"
                  >
                    <MessageCircle className="h-5 w-5 me-2" />
                    {lang === "ar" ? "اطلب عبر واتساب" : "Order via WhatsApp"}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

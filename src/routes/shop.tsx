import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, Cat, Dog, PawPrint, Search } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useBranches, useProducts } from "@/lib/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "متجر Kitty Cat Clinic — منتجات القطط والكلاب" },
      {
        name: "description",
        content:
          "تسوّق أفضل طعام ومستلزمات القطط والكلاب: طعام جاف ورطب، مكملات، ألعاب وإكسسوارات. توصيل عبر الفروع وطلب سريع عبر واتساب.",
      },
      { property: "og:title", content: "متجر Kitty Cat Clinic" },
      {
        property: "og:description",
        content: "منتجات مختارة بعناية لصحة وسعادة حيوانك الأليف.",
      },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

type PetFilter = "all" | "cat" | "dog";

function ShopPage() {
  const { t, lang } = useLanguage();
  const [pet, setPet] = useState<PetFilter>("all");
  const [search, setSearch] = useState("");
  const { data: products = [], isLoading } = useProducts(
    pet === "all" ? undefined : { petType: pet },
  );
  const { data: branches } = useBranches();
  const firstWa = branches?.[0]?.whatsapp;

  const q = search.trim().toLowerCase();
  const filtered = q
    ? products.filter((p) =>
        [p.name_ar, p.name_en, p.brand ?? ""].some((s) =>
          s.toLowerCase().includes(q),
        ),
      )
    : products;

  const tabs: { key: PetFilter; label: string; Icon: typeof Cat }[] = [
    { key: "all", label: lang === "ar" ? "الكل" : "All", Icon: PawPrint },
    { key: "cat", label: lang === "ar" ? "قطط" : "Cats", Icon: Cat },
    { key: "dog", label: lang === "ar" ? "كلاب" : "Dogs", Icon: Dog },
  ];

  return (
    <SiteLayout>
      <PageHero
        badge={
          <>
            <ShoppingBag className="h-3.5 w-3.5" />
            {lang === "ar" ? "المتجر" : "Shop"}
          </>
        }
        title={lang === "ar" ? "متجر مستلزمات حيوانك الأليف" : "Pet supplies store"}
        subtitle={
          lang === "ar"
            ? "منتجات مختارة بعناية من أفضل العلامات لصحة وسعادة قطتك وكلبك"
            : "Curated products from top brands for the health and happiness of your pet"
        }
      />

      <section className="container mx-auto px-4 py-12 md:py-16">
        {/* Filters */}
        <div className="mb-10 flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1.5 shadow-[var(--shadow-soft)]">
            {tabs.map(({ key, label, Icon }) => {
              const active = pet === key;
              return (
                <button
                  key={key}
                  onClick={() => setPet(key)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    active
                      ? "text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={
                    active ? { background: "var(--gradient-primary)" } : undefined
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>

          <div className="relative md:w-80">
            <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن منتج..." : "Search products..."}
              className="ps-9"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">
            {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              {lang === "ar"
                ? "لا توجد منتجات مطابقة"
                : "No matching products found"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} whatsapp={firstWa} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      {firstWa && (
        <section
          className="relative overflow-hidden py-12"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--primary) 12%, var(--background)) 0%, color-mix(in oklab, var(--secondary) 12%, var(--background)) 100%)",
          }}
        >
          <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center md:flex-row md:justify-between md:text-start">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">
                {lang === "ar"
                  ? "تحتاج استشارة قبل الشراء؟"
                  : "Need advice before ordering?"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {lang === "ar"
                  ? "فريقنا جاهز لمساعدتك في اختيار المنتج المناسب لحيوانك الأليف"
                  : "Our team will help you choose the right product for your pet"}
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-secondary to-secondary-glow text-secondary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95"
            >
              <a
                href={`https://wa.me/${firstWa.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener"
              >
                {t("nav.bookWhatsapp")}
              </a>
            </Button>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

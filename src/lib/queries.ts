import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type BranchRow = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  address_ar: string | null;
  address_en: string | null;
  phone: string | null;
  whatsapp: string | null;
  maps_url: string | null;
  maps_embed: string | null;
  latitude: number | null;
  longitude: number | null;
  working_hours_ar: string | null;
  working_hours_en: string | null;
  sort_order: number;
  is_active: boolean;
};

export type ServiceRow = {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type OfferRow = {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
  is_active: boolean;
};


export type ProductRow = {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  image_url: string | null;
  category: "food" | "accessories" | "toys" | "health" | "other";
  pet_type: "cat" | "dog" | "both";
  brand: string | null;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

export function useProducts(filter?: { petType?: "cat" | "dog" | "both"; category?: ProductRow["category"] }) {
  return useQuery({
    queryKey: ["products", filter?.petType ?? "all", filter?.category ?? "all"],
    queryFn: async (): Promise<ProductRow[]> => {
      let q = supabase.from("products").select("*").eq("is_active", true).order("sort_order");
      if (filter?.petType) q = q.in("pet_type", [filter.petType, "both"]);
      if (filter?.category) q = q.eq("category", filter.category);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ProductRow[];
    },
  });
}


export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: async (): Promise<BranchRow[]> => {
      const { data, error } = await supabase
        .from("branches")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as BranchRow[];
    },
  });
}

export function useServices(limit?: number) {
  return useQuery({
    queryKey: ["services", limit ?? "all"],
    queryFn: async (): Promise<ServiceRow[]> => {
      let q = supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ServiceRow[];
    },
  });
}

export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async (): Promise<OfferRow[]> => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as OfferRow[];
    },
  });
}

export type SiteSettings = {
  logo_url: string;
  favicon_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  address_ar: string;
  address_en: string;
  working_hours_ar: string;
  working_hours_en: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  instagram_order_url: string;
  instagram_learn_more_url: string;
};

const SETTINGS_MAP: Record<string, { field: keyof SiteSettings; lang?: "ar" | "en" }> = {
  "settings.logo_url": { field: "logo_url" },
  "settings.favicon_url": { field: "favicon_url" },
  "settings.phone": { field: "phone" },
  "settings.whatsapp": { field: "whatsapp" },
  "settings.email": { field: "email" },
  "settings.address": { field: "address_ar", lang: "ar" },
  "settings.working_hours": { field: "working_hours_ar", lang: "ar" },
  "settings.social.facebook": { field: "facebook" },
  "settings.social.instagram": { field: "instagram" },
  "settings.social.tiktok": { field: "tiktok" },
  "settings.social.youtube": { field: "youtube" },
  "settings.social.twitter": { field: "twitter" },
  "settings.instagram_order_url": { field: "instagram_order_url" },
  "settings.instagram_learn_more_url": { field: "instagram_learn_more_url" },
};

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    staleTime: 60_000,
    queryFn: async (): Promise<SiteSettings> => {
      const empty: SiteSettings = {
        logo_url: "", favicon_url: "", phone: "", whatsapp: "", email: "",
        address_ar: "", address_en: "", working_hours_ar: "", working_hours_en: "",
        facebook: "", instagram: "", tiktok: "", youtube: "", twitter: "",
        instagram_order_url: "", instagram_learn_more_url: "",
      };
      const { data, error } = await supabase
        .from("website_content")
        .select("key, value_ar, value_en")
        .eq("group_name", "settings");
      if (error) throw error;
      const out = { ...empty };
      for (const row of data ?? []) {
        const map = SETTINGS_MAP[row.key];
        if (!map) continue;
        // For bilingual fields, store both
        if (row.key === "settings.address") {
          out.address_ar = row.value_ar ?? "";
          out.address_en = row.value_en ?? "";
        } else if (row.key === "settings.working_hours") {
          out.working_hours_ar = row.value_ar ?? "";
          out.working_hours_en = row.value_en ?? "";
        } else {
          (out as Record<string, string>)[map.field] = row.value_ar ?? "";
        }
      }
      return out;
    },
  });
}


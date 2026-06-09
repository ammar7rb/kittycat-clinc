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

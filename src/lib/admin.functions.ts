import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error("Failed to verify admin role");
  if (!data) throw new Error("Forbidden: admin role required");
}

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [services, offers, branches, content] = await Promise.all([
      supabaseAdmin.from("services").select("id, is_active", { count: "exact" }),
      supabaseAdmin.from("offers").select("id, is_active", { count: "exact" }),
      supabaseAdmin.from("branches").select("id", { count: "exact" }),
      supabaseAdmin.from("website_content").select("id", { count: "exact" }),
    ]);

    return {
      services: {
        total: services.count ?? 0,
        active: (services.data ?? []).filter((s: any) => s.is_active).length,
      },
      offers: {
        total: offers.count ?? 0,
        active: (offers.data ?? []).filter((o: any) => o.is_active).length,
      },
      branches: { total: branches.count ?? 0 },
      content: { total: content.count ?? 0 },
    };
  });

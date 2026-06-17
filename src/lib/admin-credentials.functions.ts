import { createServerFn } from "@tanstack/react-start";

export const updateAdminCredentials = createServerFn({ method: "POST" }).handler(
  async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = "785c8c09-058a-4bc3-813b-b12e73121443";
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email: "kitty.cat.clinic1@gmail.com",
      password: "Admin_2026_kittycatclinics_Axel",
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    return { ok: true, email: data.user?.email };
  },
);

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { assertAdmin } from "./admin.functions";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const listMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        file_name: z.string().min(1).max(255),
        mime_type: z.string().refine((t) => ALLOWED_TYPES.includes(t), {
          message: "نوع الملف غير مدعوم",
        }),
        size_bytes: z.number().int().positive().max(MAX_SIZE),
        base64: z.string().min(1),
        alt_text: z.string().max(500).optional().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Decode base64
    const buffer = Buffer.from(data.base64, "base64");
    if (buffer.byteLength > MAX_SIZE) throw new Error("حجم الملف أكبر من 5MB");

    // Safe filename
    const ext = (data.file_name.split(".").pop() || "bin")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const storagePath = `uploads/${safeName}`;

    const { error: upErr } = await supabaseAdmin.storage
      .from("media")
      .upload(storagePath, buffer, {
        contentType: data.mime_type,
        upsert: false,
      });
    if (upErr) throw new Error(upErr.message);

    const { data: pub } = supabaseAdmin.storage.from("media").getPublicUrl(storagePath);

    const { data: row, error } = await supabaseAdmin
      .from("media")
      .insert({
        file_name: data.file_name,
        storage_path: storagePath,
        public_url: pub.publicUrl,
        mime_type: data.mime_type,
        size_bytes: data.size_bytes,
        alt_text: data.alt_text ?? null,
        uploaded_by: context.userId,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateMediaAlt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), alt_text: z.string().max(500).nullable() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("media")
      .update({ alt_text: data.alt_text })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error: fErr } = await supabaseAdmin
      .from("media")
      .select("storage_path")
      .eq("id", data.id)
      .single();
    if (fErr) throw new Error(fErr.message);

    await supabaseAdmin.storage.from("media").remove([row.storage_path]);

    const { error } = await supabaseAdmin.from("media").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

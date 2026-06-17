import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "./auth-middleware";

/**
 * Middleware that ensures the caller is authenticated AND has the 'admin' role.
 * Use on every server function that mutates admin data or returns admin-only info.
 */
export const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) {
      console.error("[requireAdmin] has_role check failed", error);
      throw new Error("Forbidden: failed to verify admin role");
    }
    if (!data) {
      throw new Error("Forbidden: admin role required");
    }
    return next();
  });

import { prisma } from "@/lib/db";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Find or create a DB user in public.users from a Supabase Auth user.
 * Uses supabaseId (auth UUID) as the lookup key.
 * Reusable across auth callback, checkout, and orders routes.
 */
export async function findOrCreateDbUser(authUser: SupabaseUser) {
    const existing = await prisma.user.findUnique({
        where: { supabaseId: authUser.id },
    });

    if (existing) return existing;

    return prisma.user.create({
        data: {
            email: authUser.email!,
            name: authUser.user_metadata?.full_name || null,
            supabaseId: authUser.id,
        },
    });
}

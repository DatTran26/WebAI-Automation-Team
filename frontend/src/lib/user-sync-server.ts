import { prisma } from "@/lib/db";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Server-side helper (for API routes)
 * Find or create a DB user in public.users from a Supabase Auth user.
 */
export async function findOrCreateDbUser(authUser: SupabaseUser) {
    const existing = await prisma.user.findUnique({
        where: { supabaseId: authUser.id },
    });

    const metadata = authUser.user_metadata || {};

    if (existing) {
        // Update existing user with metadata if fields are missing in DB but present in metadata
        const updates: Record<string, string | Date> = {};
        if (!existing.phone && metadata.phone) updates.phone = metadata.phone;
        if (!existing.gender && metadata.gender) updates.gender = metadata.gender;
        if (!existing.birthday && metadata.birthday) updates.birthday = new Date(metadata.birthday);
        
        if (Object.keys(updates).length > 0) {
            return prisma.user.update({
                where: { id: existing.id },
                data: updates,
            });
        }
        return existing;
    }

    return prisma.user.create({
        data: {
            email: authUser.email!,
            name: metadata.full_name || metadata.name || null,
            supabaseId: authUser.id,
            phone: metadata.phone || null,
            gender: metadata.gender || null,
            birthday: metadata.birthday ? new Date(metadata.birthday) : null,
        },
    });
}

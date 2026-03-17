import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function createSupabaseServerClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );
}

/** Returns the currently authenticated Supabase user, or null */
export async function getCurrentUser() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/** Returns true if user has admin privileges.
 *  Primary: Supabase app_metadata.role === 'admin'
 *  Fallback: email matches ADMIN_EMAIL env var */
export async function getIsAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;
    if (user.app_metadata?.role === "admin") return true;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email) {
        const adminEmails = adminEmail.split(",").map((e) => e.trim());
        if (adminEmails.includes(user.email)) return true;
    }
    return false;
}

/** Throws if the current user is not admin – use in admin API routes */
export async function requireAdmin(): Promise<void> {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) throw new Error("FORBIDDEN");
}

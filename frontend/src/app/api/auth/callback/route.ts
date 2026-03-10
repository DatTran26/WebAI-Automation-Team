import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findOrCreateDbUser } from "@/lib/user-sync";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Sync Supabase Auth user → public.users on every login
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await findOrCreateDbUser(user);
                }
            } catch (syncError) {
                // Non-blocking: log but don't prevent login
                console.error("User sync failed:", syncError);
            }

            return NextResponse.redirect(new URL(next, request.url));
        }
    }

    return NextResponse.redirect(new URL("/account?error=auth", request.url));
}

import { prisma } from "@/lib/db";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json(null);

        const dbUser = await prisma.user.findUnique({
            where: { supabaseId: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            }
        });

        return NextResponse.json(dbUser);
    } catch (error) {
        console.error("GET /api/user/me error:", error);
        return NextResponse.json(null);
    }
}

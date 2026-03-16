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
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const addresses = await prisma.address.findMany({
            where: { user: { supabaseId: user.id } },
            orderBy: { id: "desc" }
        });

        return NextResponse.json(addresses);
    } catch (error) {
        console.error("GET /api/user/addresses error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
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
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
        if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const { label, line1, line2, city, state, zip, country } = await request.json();

        const newAddress = await prisma.address.create({
            data: {
                userId: dbUser.id,
                label,
                line1,
                line2,
                city,
                state,
                zip,
                country: country || "VN",
            }
        });

        return NextResponse.json(newAddress);
    } catch (error) {
        console.error("POST /api/user/addresses error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
